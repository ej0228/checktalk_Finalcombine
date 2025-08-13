package com.talk.back.admin.notice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminNoticeUpdateDto(
        @NotBlank @Size(max=255) String title,
        @NotBlank String content,
        Boolean pinned,
        Boolean visible
) {}
