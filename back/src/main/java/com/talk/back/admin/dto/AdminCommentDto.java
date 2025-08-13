package com.talk.back.admin.dto;

import com.talk.back.community.entity.Comment;
import com.talk.back.community.entity.ReportAction;
import com.talk.back.community.entity.ReportStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminCommentDto {

    private Long commentId;
    private String authorEmail;
    private String content;
    private LocalDateTime createdAt;
    private int reportCount;

    private boolean hiddenByReport; // ✅ 신고 누적으로 자동 숨김된 글 여부
    private boolean deleted;        // ✅ 사용자가 직접 삭제한 글 여부

    private String reason;          // ✅ 관리자에게 보여줄 신고 사유 (마지막 사유)

    private ReportStatus reportStatus; // 신고된 게시글의 처리 진행 상태(대기 / 완료)
    private ReportAction reportAction; // 신고된 게시글의 처리 결과(복구 / 삭제 / 없음)


    /**
     * Comment 엔티티로부터 AdminCommentDto 생성
     * - 관리자 모드에서 신고된 글과 숨김 상태 확인용
     * - 마지막 신고 사유 1개만 표시
     */
    public static AdminCommentDto from(Comment comment) {
        // 🔍 마지막으로 작성된 신고 사유 가져오기 (취소되지 않은 것 중에서)
        String latestReason = comment.getReports().stream()
                .filter(r -> !r.isCanceled())
                .map(r -> r.getReason())
                .reduce((first, second) -> second) // 마지막 신고 사유
                .orElse("사유 없음");

        return AdminCommentDto.builder()
                .commentId(comment.getCommentId())
                .authorEmail(comment.getUser().getEmail())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .reportCount(comment.getReportCount())
                .hiddenByReport(comment.isHiddenByReport())
                .deleted(comment.isDeleted())
                .reason(latestReason)
                .reportStatus(comment.getReportStatus()) // 신고된 게시글의 처리 진행 상태
                .reportAction(comment.getReportAction()) // 신고된 게시글의 처리 결과

                .build();
    }
}
