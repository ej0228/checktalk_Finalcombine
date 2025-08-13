package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminCommentDto;
import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.community.entity.Comment;
import com.talk.back.community.entity.ReportAction;
import com.talk.back.community.entity.ReportStatus;
import com.talk.back.community.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminCommunityService {

    private final CommentRepository commentRepository;
    private final AdminLogService adminLogService;

    /**
     * 🚩 관리자 모드 - 신고된 게시글 목록 조회
     * - 신고 수 3회 이상 && 숨김 처리된 게시글만 조회
     * - 삭제된 글도 포함 (관리자 입장에서 처리 상태를 봐야 하므로)
     */
    public Page<AdminCommentDto> getReportedComments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return commentRepository.findByReportCountGreaterThanEqualAndHiddenByReportTrueOrReportStatus(
                3, ReportStatus.RESOLVED, pageable
        ).map(AdminCommentDto::from);
    }

    /**
     * ✅ 관리자 복구 기능
     * - 신고 누적으로 숨겨진 게시글을 다시 사용자에게 보이게 함
     * - 신고 수를 0으로 초기화
     * - 숨김 상태 해제
     * - 처리 상태/결과 업데이트
     */
    public void restoreComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        comment.setReportCount(0);
        comment.setHiddenByReport(false);
        comment.setReportStatus(ReportStatus.RESOLVED);     // ✅ 처리 완료
        comment.setReportAction(ReportAction.RESTORED);     // ✅ 복구 처리
        commentRepository.save(comment);

        // 관리자 로그 기록
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        adminLogService.saveLog(AdminLogType.RESTORED_POST, adminUsername);
    }

    /**
     * 🗑 관리자 삭제 기능 (Soft Delete)
     * - 실제 삭제하지 않고 deleted = true, 숨김 처리 유지
     * - 사용자에게는 보이지 않음
     * - 관리자 모드에선 확인 가능
     */
    public void softDeleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        comment.setDeleted(true);                        // ✅ 사용자에겐 안 보이도록
        comment.setHiddenByReport(true);                 // ✅ 숨김 유지
        comment.setReportStatus(ReportStatus.RESOLVED);  // ✅ 처리 완료
        comment.setReportAction(ReportAction.DELETED);   // ✅ 삭제 처리
        commentRepository.save(comment);

        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        adminLogService.saveLog(AdminLogType.DELETED_POST, adminUsername);
    }

    /**
     * 🚩 관리자 모드 - 처리 상태별 신고글 필터링 조회
     * - 처리 상태(PENDING / RESOLVED)에 따라 조회
     * - 신고 수 3 이상 && 숨김 처리 && 처리 상태 일치
     */
    public Page<AdminCommentDto> getReportedCommentsFiltered(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        ReportStatus reportStatus = ReportStatus.valueOf(status); // 예: "PENDING" or "RESOLVED"

        return commentRepository
                .findByReportCountGreaterThanEqualAndHiddenByReportTrueAndReportStatus(3, reportStatus, pageable)
                .map(AdminCommentDto::from);
    }
}
