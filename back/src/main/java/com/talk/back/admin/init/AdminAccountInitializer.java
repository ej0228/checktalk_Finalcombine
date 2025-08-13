package com.talk.back.admin.init;

import com.talk.back.admin.entity.AdminUser;
import com.talk.back.admin.repository.AdminUserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 개발 환경에서만 실행되는 관리자 계정 초기화 컴포넌트입니다.
 *
 * - @Profile("local") 설정으로 local 환경에서만 동작합니다.
 * - Spring Boot 서버 실행 직후(@PostConstruct)에 한 번 실행됩니다.
 * - 관리자 계정이 존재하지 않을 경우, 기본 계정을 생성합니다.
 * - 필요하지 않을 경우 @Component 주석처리
 */
@Profile({"dev","local"})
//@Component
@RequiredArgsConstructor
public class AdminAccountInitializer {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    //기본 관리자 계정 정보는 클래스 전역에서 사용되며, 수정되지 않기 때문에 상수(static final)로 선언합니다.
    // → 클래스 상단에 전역 변수화하여 가독성과 재사용성 향상
    // → 코드 오타 방지, 의미 명확화, 유지보수 용이
    private static final String DEFAULT_USERNAME = "admin1";
    private static final String DEFAULT_PASSWORD  = "admin1234";

    @PostConstruct
    public void initAdminAccount() {

        if (adminUserRepository.findByUsername(DEFAULT_USERNAME).isPresent()) {
            System.out.println("관리자 계정 이미 존재함: " + DEFAULT_USERNAME);
            return;
        }

        AdminUser admin = AdminUser.builder()
                .username(DEFAULT_USERNAME)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role("ADMIN")               // ✅ 필수

                .build();

        adminUserRepository.save(admin);
        System.out.println("관리자 계정 자동 생성 완료: " + DEFAULT_USERNAME);
    }
}
