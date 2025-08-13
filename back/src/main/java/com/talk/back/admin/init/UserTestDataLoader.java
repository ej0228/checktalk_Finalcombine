// src/main/java/com/talk/back/admin/init/UserTestDataLoader.java
package com.talk.back.admin.init;

import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//@Component
@Profile({"dev","local"})            // ✅ 로컬에서만 활성화
@Order(999)                   // ✅ 다른 Runner들보다 거의 마지막 실행
@RequiredArgsConstructor
public class UserTestDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ===== 커스터마이즈 포인트 =====
    private static final int USER_COUNT   = 20;               // 생성할 사용자 수
    private static final String PW_PLAIN  = "qwer1234";       // 로그인용 평문(BCrypt로 저장)
    private static final String EMAIL_FMT = "user%02d@test.com"; // user01@test.com ...

    @Override
    public void run(String... args) {
        System.out.println("\n=============================");
        System.out.println("[UserSeed] START (profile=local)");
        System.out.println("=============================");

        long existing = userRepository.count();
        System.out.println("[UserSeed] users.count=" + existing);

        if (existing > 0) {
            System.out.println("[UserSeed] Skip: users already exist.");
            System.out.println("=============================\n");
            return;
        }

        List<User> seeds = new ArrayList<>(USER_COUNT);
        for (int i = 1; i <= USER_COUNT; i++) {
            seeds.add(User.builder()
                    .email(EMAIL_FMT.formatted(i))
                    .password(passwordEncoder.encode(PW_PLAIN))   // ✅ BCrypt 저장
                    .name("사용자" + i)
                    .phone(String.format("010-0000-%04d", i))
                    .birthDate(LocalDate.of(1995, 1, 1))
                    .gender(i % 2 == 0 ? Gender.FEMALE : Gender.MALE)
                    .job(JobType.STUDENT)
                    .interest(InterestType. COUNSELING)
                    .usagePurpose(PurposeType.SCHOOL_PROJECT)
                    .communicationGoal("로컬 로그인 테스트")
                    // ✅ 로그인 가능 조건
                    .role(Role.USER)
                    .status(UserStatus.ACTIVE)
                    .emailVerified(true)
                    .deleted("N")
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        userRepository.saveAll(seeds);
        System.out.println("[UserSeed] Created users = " + seeds.size() + " (pw=" + PW_PLAIN + ")");
        System.out.println("=============================\n");
    }
}
