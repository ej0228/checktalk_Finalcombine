
package com.talk.back.admin.init;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * ✅ 테스트용 계정 비밀번호 해시 생성기
 * - 이 클래스는 서버 실행 시 자동 실행되지 않습니다.
 * - 콘솔에서 직접 실행하세요.
 * - 콘솔에 BCrypt 해시값 출력
 * - SQL 삽입용으로 사용 가능
 */
public class PasswordHasher {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin1234";
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("🔐 Hashed password: " + hashedPassword);
    }
}