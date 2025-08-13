package com.talk.back.auth.service;

import jakarta.transaction.Transactional;
import com.talk.back.auth.entity.EmailVerification;
import com.talk.back.auth.repository.EmailVerificationRepository;
import com.talk.back.enums.VerificationPurpose;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

/**
 * 이메일 인증 기능을 담당하는 서비스 클래스
 *
 * [역할]
 * - 인증 코드 생성 및 저장
 * - 인증 코드 검증 및 상태 변경
 * - 인증 요청 목적(purpose)을 기준으로 인증 흐름 분리
 * - 코드 만료 시간 관리 (기본 10분)
 */
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final MailService mailService;

    /**
     * 인증 코드 생성 및 저장
     *
     * @param email 인증을 요청한 이메일 주소
     * @param purpose 인증 목적 (회원가입, 비밀번호 재설정 등)
     * @return 생성된 인증 코드
     */
    @Transactional
    public String generateAndSaveVerificationCode(String email, VerificationPurpose purpose) {
        // 이메일 정규화
        String normalizedEmail = email.trim().toLowerCase();

        String code = generate6DigitCode();

        EmailVerification verification = EmailVerification.builder()
                .email(normalizedEmail)
                .code(code)
                .issuedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .purpose(purpose)
                .build();

        emailVerificationRepository.save(verification);

        // 메일 발송
        mailService.sendVerificationCode(normalizedEmail, code, purpose);

        return code;
    }


    /**
     * 인증 코드 확인 및 검증 처리
     *
     * @param email 이메일 주소
     * @param code 사용자 입력 인증 코드
     * @param purpose 인증 목적
     * @return 인증 성공 여부 (true: 인증 성공, false: 실패 또는 만료)
     */
    @Transactional
    public boolean verifyCode(String email, String code, VerificationPurpose purpose) {
        Optional<EmailVerification> optional = emailVerificationRepository
                .findByEmailAndCodeAndPurpose(email, code, purpose);

        if (optional.isEmpty()) return false;

        EmailVerification verification = optional.get();

        boolean isValid = !verification.isVerified()
                && verification.getExpiresAt().isAfter(LocalDateTime.now());

        if (isValid) {
            verification.setVerified(true);
            emailVerificationRepository.save(verification);
            return true;
        }

        return false;
    }

    /**
     * 특정 이메일이 해당 목적에 대해 인증 완료되었는지 확인
     *
     * @param email 이메일
     * @param purpose 인증 목적
     * @return 인증 완료 여부
     */
    public boolean isVerified(String email, VerificationPurpose purpose) {
        return emailVerificationRepository
                .findTopByEmailAndPurposeOrderByIssuedAtDesc(email, purpose)
                .map(EmailVerification::isVerified)
                .orElse(false);
    }

    /**
     * 6자리 숫자 인증 코드 생성
     * - 000000 ~ 999999 범위 내에서 생성
     *
     * @return 문자열 형식의 인증 코드
     */
    private String generate6DigitCode() {
        Random random = new Random();
        int number = random.nextInt(1_000_000); // 0~999999
        return String.format("%06d", number);   // 항상 6자리로 포맷팅 (예: 003457)
    }
}
