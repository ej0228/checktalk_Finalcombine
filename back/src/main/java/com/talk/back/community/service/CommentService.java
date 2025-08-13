package com.talk.back.community.service;

import jakarta.transaction.Transactional;
import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.community.dto.CommentCreateDto;
import com.talk.back.community.dto.CommentResponseDto;
import com.talk.back.community.dto.CommentUpdateDto;
import com.talk.back.community.entity.Comment;
import com.talk.back.community.entity.CommentLike;
import com.talk.back.community.entity.CommentReport;
import com.talk.back.community.repository.CommentLikeRepository;
import com.talk.back.community.repository.CommentReportRepository;
import com.talk.back.community.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final CommentReportRepository commentReportRepository;

    // ✅ 댓글 조회 (삭제 + 신고 숨김 제외) - 리스트형
    public List<CommentResponseDto> getComments(int page, User user) {
        PageRequest pageable = PageRequest.of(page, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> result = commentRepository.findByDeletedFalseOrderByCreatedAtDesc(pageable);

        return result.stream()
                .map(comment -> {
                    boolean liked = commentLikeRepository.existsByUserAndComment(user, comment);
                    boolean reported = commentReportRepository.existsByUserAndCommentAndCanceledFalse(user, comment);
                    long likeCount = commentLikeRepository.countByComment(comment);
                    boolean mine = comment.getUser().getEmail().equals(user.getEmail());
                    return CommentResponseDto.from(comment, liked, reported, likeCount, mine);
                })
                .toList();
    }

    // ✅ 댓글 조회 (삭제 + 신고 숨김 제외) - 페이지정보 포함
    public Map<String, Object> getCommentsWithPageInfo(int page, User user) {
        PageRequest pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());
        Page<Comment> result = commentRepository.findByDeletedFalseOrderByCreatedAtDesc(pageable);
        List<CommentResponseDto> content = result.stream()
                .filter(comment -> comment.getUser() != null) // 혹시 모를 null 방지!
                .map(comment -> {
                    User author = comment.getUser();

                    boolean mine = false;
                    if (author != null && author.getEmail() != null && user != null && user.getEmail() != null) {
                        mine = author.getEmail().equals(user.getEmail());
                    }

                    boolean liked = commentLikeRepository.existsByUserAndComment(user, comment);
                    boolean reported = commentReportRepository.existsByUserAndCommentAndCanceledFalse(user, comment);
                    long likeCount = commentLikeRepository.countByComment(comment);

                    return CommentResponseDto.from(comment, liked, reported, likeCount, mine);
                })
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("totalPages", result.getTotalPages());
        response.put("currentPage", result.getNumber());

        return response;

    }

    // 댓글 작성
    public CommentResponseDto createComment(User user, CommentCreateDto dto) {
        Comment comment = Comment.builder()
                .user(user)
                .content(dto.getContent())
                .createdAt(LocalDateTime.now())
                .likeCount(0)     // 초기값
                .reportCount(0)   // 초기값
                .deleted(false)
                .hiddenByReport(false) // ✅ 기본값 명시
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentResponseDto.from(saved, false, false, 0, true);
    }

    // 좋아요 토글
    @Transactional
    public CommentResponseDto toggleLike(User user, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 없음"));

        Optional<CommentLike> existing = commentLikeRepository.findByUserAndComment(user, comment);

        if (existing.isPresent()) {
            // 이미 눌렀으면 삭제
            commentLikeRepository.delete(existing.get());
        } else {
            try {
                commentLikeRepository.save(new CommentLike(user, comment));
            } catch (Exception e) {
                throw new RuntimeException("좋아요 저장 중 오류 발생: " + e.getMessage());
            }
        }

        // 최신 상태 계산
        long likeCount = commentLikeRepository.countByComment(comment);
        boolean liked = commentLikeRepository.existsByUserAndComment(user, comment);
        boolean reported = commentReportRepository.existsByUserAndCommentAndCanceledFalse(user, comment);
        boolean mine = comment.getUser().getEmail().equals(user.getEmail());

        return CommentResponseDto.from(comment, liked, reported, likeCount, mine);
    }

    // 🚨 신고 토글
    @Transactional
    public CommentResponseDto toggleReport(User user, Long commentId, String reason) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));


        // 본인 글 신고 금지 (null-safe)
        User author = comment.getUser();
        if (author != null && user != null && author.getUserId() != null && user.getUserId() != null &&
                author.getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("본인의 댓글은 신고할 수 없습니다.");
        }

        // 기존 신고 여부 확인 (toggle 구조)
        Optional<CommentReport> existing = commentReportRepository.findByUserAndComment(user, comment);

        if (existing.isPresent()) {
            CommentReport report = existing.get();
            if (!report.isCanceled()) {
                report.setCanceled(true);
                comment.setReportCount(comment.getReportCount() - 1);
            } else {
                report.setCanceled(false);
                report.setReason(reason);
                comment.setReportCount(comment.getReportCount() + 1);
            }
        } else {
            CommentReport report = CommentReport.builder()
                    .user(user)
                    .comment(comment)
                    .reason(reason)
                    .canceled(false)
                    .build();
            commentReportRepository.save(report);
            comment.setReportCount(comment.getReportCount() + 1);
        }

        // ✅ 유효한 신고가 3건 이상이면 숨김 처리
        int validReports = commentReportRepository.countByCommentAndCanceledFalse(comment);
        if (validReports >= 3) {
            comment.setHiddenByReport(true);
        }


        // 최신 상태 재계산
        boolean liked = commentLikeRepository.existsByUserAndComment(user, comment);
        boolean reported = commentReportRepository.existsByUserAndCommentAndCanceledFalse(user, comment);
        long likeCount = commentLikeRepository.countByComment(comment);

        // 안전한 본인 확인
        boolean mine = comment.getUser() != null &&
                user != null &&
                comment.getUser().getEmail() != null &&
                comment.getUser().getEmail().equals(user.getEmail());

        return CommentResponseDto.from(comment, liked, reported, likeCount, mine);
    }

    // 댓글 수정
    @Transactional
    public CommentResponseDto updateComment(User user, Long commentId, CommentUpdateDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        // 본인 확인
        if (!comment.getUser().getEmail().equals(user.getEmail())) {
            throw new SecurityException("본인의 댓글만 수정할 수 있습니다.");
        }

        // 수정
        comment.setContent(dto.getContent());


        // 최신 상태로 변환
        boolean liked = commentLikeRepository.existsByUserAndComment(user, comment);
        boolean reported = commentReportRepository.existsByUserAndCommentAndCanceledFalse(user, comment);
        long likeCount = commentLikeRepository.countByComment(comment);
        boolean mine = true;


        return CommentResponseDto.from(comment, liked, reported, likeCount, mine);
    }

    // 댓글 삭제 (Soft delete)
    @Transactional
    public void deleteComment(User user, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        // 본인 확인
        if (!comment.getUser().getEmail().equals(user.getEmail())) {
            throw new SecurityException("본인의 댓글만 삭제할 수 있습니다.");
        }

        // soft delete
        comment.setDeleted(true);
    }
}
