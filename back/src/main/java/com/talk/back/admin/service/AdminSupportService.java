package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminSupportAnswerDto;
import com.talk.back.admin.dto.AdminSupportPostDto;
import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.admin.entity.AdminSupportAnswer;
import com.talk.back.admin.repository.AdminSupportAnswerRepository;
import com.talk.back.qna.entity.SupportPost;
import com.talk.back.qna.repository.SupportPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminSupportService {

    private final SupportPostRepository supportPostRepository;
    private final AdminSupportAnswerRepository answerRepository;
    private final AdminLogService adminLogService;

    // 질문글 전체 조회 (최신순 + 필터링)
    @Transactional(readOnly = true)
    public Page<AdminSupportPostDto> getPagedPosts(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<SupportPost> posts;
        if (status == null || status.equals("전체")) {
            posts = supportPostRepository.findAllByOrderByCreatedAtDesc(pageable);
        } else if (status.equals("처리완료")) {
            posts = supportPostRepository.findByStatus("처리완료", pageable);
        } else {
            posts = supportPostRepository.findByStatusNot("처리완료", pageable);
        }

        return posts.map(post ->
                AdminSupportPostDto.from(post, answerRepository.findByPostId(post.getId()))
        );
    }

    @Transactional(readOnly = true)
    public AdminSupportPostDto getPostById(Long id) {
        SupportPost post = supportPostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 질문글이 존재하지 않습니다."));

        Optional<AdminSupportAnswer> answerOpt = answerRepository.findByPostId(id);
        return AdminSupportPostDto.from(post, answerOpt);
    }

    // 답변 등록
    @Transactional
    public void writeAnswer(Long postId, AdminSupportAnswerDto dto) {
        SupportPost post = supportPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 질문글이 존재하지 않습니다."));

        if (answerRepository.findByPostId(postId).isPresent()) {
            throw new IllegalStateException("이미 답변이 등록되어 있습니다.");
        }

        AdminSupportAnswer answer = AdminSupportAnswer.builder()
                .post(post)
                .content(dto.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        answerRepository.save(answer);

        post.setStatus("처리완료");
        supportPostRepository.save(post);

        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        adminLogService.saveLog(AdminLogType.SUPPORT_REPLY_CREATED, adminUsername);
    }

    // 답변 수정
    @Transactional
    public void updateAnswer(Long postId, AdminSupportAnswerDto dto) {
        AdminSupportAnswer answer = answerRepository.findByPostId(postId)
                .orElseThrow(() -> new IllegalArgumentException("등록된 답변이 없습니다."));

        answer.setContent(dto.getContent());

        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        adminLogService.saveLog(AdminLogType.SUPPORT_REPLY_UPDATED, adminUsername);
    }

    @Transactional(readOnly = true)
    public long countPendingSupportPosts() {
        return supportPostRepository.countByStatusNot("처리완료");
    }
}
