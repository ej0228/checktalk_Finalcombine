package com.talk.back.qna.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ✅ 사용자 질문글 응답 DTO
 * - 관리자 답변/사용자 댓글은 포함하지 않음
 * - 파일, 상태, 작성자 정보만 포함
 */
@Getter
@Builder
public class SupportPostResponseDto {

    private Long id;                  // 질문글 ID
    private String type;              // 질문 유형 (예: 환불, 계정 등)
    private String title;             // 제목
    private String content;           // 본문

    // 작성자 정보
    private String authorName;
    private String authorEmail;
    private String authorPhone;
    private Long authorUserId;        // ← 작성자 고유 ID 추가

    // 상태 정보
    private String status;            // 처리중 / 확인중 / 완료 등
    private boolean isNewPost;
    private int colorIndex;
    private int views;

    private LocalDateTime createdAt;  // 작성일

    // 첨부 파일 목록
    private List<SupportFileDto> files;

    // 관리자 답변 조회
    private String answerContent;  // ✅ 추가
}
