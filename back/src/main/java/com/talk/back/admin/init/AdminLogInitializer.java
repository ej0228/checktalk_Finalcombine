package com.talk.back.admin.init;

import com.talk.back.admin.entity.AdminLog;
import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.admin.repository.AdminLogRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;

/**
 * 개발 환경(local)에서만 실행되는 관리자 로그 더미 데이터 초기화 컴포넌트입니다.
 */
@Profile({"dev","local"})
//@Component
@RequiredArgsConstructor
public class AdminLogInitializer {

    private final AdminLogRepository logRepo;

    private static final String ADMIN_3 = "admin3";
    private static final String ADMIN_2 = "admin2";

    @PostConstruct
    public void init() {
        logRepo.save(AdminLog.builder()
                .type(AdminLogType.LOGIN)
                .user(ADMIN_3)
                .timestamp(LocalDateTime.now())
                .build());

        logRepo.save(AdminLog.builder()
                .type(AdminLogType.DEACTIVATE_USER)
                .user(ADMIN_2)
                .timestamp(LocalDateTime.now().minusDays(1))
                .build());

        System.out.println("관리자 로그 테스트 데이터 2건 자동 삽입 완료");
    }
}
