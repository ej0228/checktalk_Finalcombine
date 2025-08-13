package com.talk.back.admin.notice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminNoticeCreateDto(
        @NotBlank @Size(max=255) String title,
        @NotBlank String content,
        Boolean pinned,   // null 허용, 기본 false
        Boolean visible   // null 허용, 기본 true
) {}
