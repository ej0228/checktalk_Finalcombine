package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminUserLogDto;
import com.talk.back.admin.entity.AdminUserLog;
import com.talk.back.admin.entity.AdminUserLogType;
import com.talk.back.admin.repository.AdminUserLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserLogServiceImpl implements AdminUserLogService {

    private final AdminUserLogRepository adminUserLogRepository;

    @Override
    public void saveLog(Long userId, AdminUserLogType type, String ipAddress) {
        adminUserLogRepository.save(
                AdminUserLog.builder()
                        .userId(userId)
                        .actionType(type)
                        .ipAddress(ipAddress)
                        .actionTime(LocalDateTime.now())
                        .build()
        );
    }

    @Override
    public Page<AdminUserLogDto> getFilteredLogs(String name, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime start = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime end = (endDate != null) ? endDate.plusDays(1).atStartOfDay().minusSeconds(1) : null;

        return adminUserLogRepository.findProjectedLogs(name, start, end, pageable);
    }
}
