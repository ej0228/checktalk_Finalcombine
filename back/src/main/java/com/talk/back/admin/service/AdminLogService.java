package com.talk.back.admin.service;

import com.talk.back.admin.entity.AdminLog;
import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.admin.repository.AdminLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminLogService {

    private final AdminLogRepository logRepository;

    /**
     * 관리자 활동 로그 저장 (일반용 - 상세 없음)
     * @param type 작업 유형 (예: LOGIN, DEACTIVATE_USER 등)
     * @param username 관리자 아이디
     */
    public void saveLog(AdminLogType type, String username) {
        saveLog(type, username, null);
    }

    /**
     * 관리자 활동 로그 저장 (상세 정보 포함)
     * @param type 작업 유형
     * @param username 관리자 아이디
     * @param details 추가 상세 정보 (예: recordId=42, subject contains "진화론")
     */
    public void saveLog(AdminLogType type, String username, String details) {
        AdminLog log = AdminLog.builder()
                .type(type)
                .user(username)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();

        logRepository.save(log);
    }

    /**
     * 관리자 로그 목록 (페이지네이션)
     */
    public Page<AdminLog> getLogsPaged(Pageable pageable) {
        return logRepository.findAll(pageable);
    }
}
