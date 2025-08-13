package com.talk.back.admin.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserLogDto {
    private Long id;
    private Long userId;
    private String userName; // ✅ 추가
    private String ipAddress;
    private LocalDateTime actionTime;
}
