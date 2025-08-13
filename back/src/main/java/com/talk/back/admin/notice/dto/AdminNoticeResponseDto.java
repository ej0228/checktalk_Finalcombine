// src/main/java/com/talk/back/admin/notice/dto/AdminNoticeResponseDto.java
package com.talk.back.admin.notice.dto;

import com.talk.back.admin.notice.entity.AdminNotice;
import java.time.LocalDateTime;

public record AdminNoticeResponseDto(
        Long id,
        String title,
        String content,
        boolean pinned,
        boolean visible,
        String writerName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    // ✅ 엔티티 → DTO 변환
    public static AdminNoticeResponseDto from(AdminNotice e) {
        // AdminUser에 표시할 필드가 name 인지 username 인지 프로젝트에 맞게 선택
        String writerName = null;
        if (e.getWriter() != null) {
            // writerName = e.getWriter().getName();      // 🔁 팀 구현에 따라 선택
            writerName = e.getWriter().getUsername();     // 🔁 또는 username 사용
        }

        return new AdminNoticeResponseDto(
                e.getId(),
                e.getTitle(),
                e.getContent(),
                e.isPinned(),
                e.isVisible(),
                writerName,
                e.getCreatedAt(),
                e.getUpdatedAt()
        );
    }
}
