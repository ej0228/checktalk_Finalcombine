package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminUserLogDto;
import com.talk.back.admin.entity.AdminUserLogType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminUserLogService {

    // 사용자 로그인 로그 저장
    void saveLog(Long userId, AdminUserLogType type, String ipAddress);

    // 사용자 이름 + 날짜 범위로 필터된 로그인 로그 조회
    Page<AdminUserLogDto> getFilteredLogs(String name, LocalDate startDate, LocalDate endDate, Pageable pageable);
}
