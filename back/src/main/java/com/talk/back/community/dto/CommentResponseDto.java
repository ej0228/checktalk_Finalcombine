package com.talk.back.community.dto;

import com.talk.back.community.entity.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponseDto {

    private Long commentId;
    private String authorName;
    private String emailMasked;
    private String content;
    private boolean mine;       // User가 작성한 댓글인지 여부

    // 좋아요 관련
    private long likeCount;
    private boolean liked;

    // 신고 관련
    private int reportCount;
    private boolean reported; // 신고했는지 여부 추가
    private boolean deleted;

    private LocalDateTime createdAt;

    /**
     * 댓글 정보를 기반으로 DTO 생성
     * @param comment 실제 댓글 엔티티
     * @param liked   현재 로그인한 사용자가 좋아요 눌렀는지 여부
     * @param reported 현재 로그인한 사용자가 신고했는지 여부
     */
    public static CommentResponseDto from(Comment comment, boolean liked, boolean reported, long likeCount, boolean mine) {
        return CommentResponseDto.builder()
                .commentId(comment.getCommentId())
                .authorName(comment.getUser().getName())
                .emailMasked(maskEmail(comment.getUser().getEmail()))
                .content(comment.getContent())
                .mine(mine)

                // 좋아요
                .likeCount(likeCount)
                .liked(liked)

                // 신고
                .reportCount(comment.getReportCount())
                .reported(reported)

                .deleted(comment.isDeleted())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    /**
     * 이메일 마스킹 처리: ab****@domain.com
     */
    private static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String username = parts[0];
        String domain = parts[1];

        if (username.length() <= 3) return "***@" + domain;
        String visibleStart = username.substring(0, 2);
        String visibleEnd = username.substring(username.length() - 1);
        return visibleStart + "***" + visibleEnd + "@" + domain;
    }
}
