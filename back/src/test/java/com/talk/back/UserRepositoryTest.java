package com.talk.back;

import com.talk.back.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findUserTest() {
        userRepository.findTopByEmailOrderByCreatedAtDesc("9checktalk@gmail.com")
                .ifPresentOrElse(
                        user -> System.out.println("조회 성공: " + user),
                        () -> System.out.println("해당 이메일 없음")
                );
    }
}
