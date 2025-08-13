package com.talk.back.auth.service;

import jakarta.annotation.PostConstruct;
import com.talk.back.enums.VerificationPurpose;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 인증 이메일 전송을 담당하는 서비스 클래스
 *
 * [역할]
 * - 인증 코드 포함 이메일 발송
 * - 인증 목적(SIGNUP, RESET)에 따라 이메일 제목 및 내용 다르게 설정
 * - 인증 코드는 10분간 유효함
 */
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    /**
     * 인증 코드 전송 메서드
     *
     * @param toEmail 수신자 이메일 주소
     * @param code    6자리 인증 코드
     * @param purpose 인증 목적 (회원가입, 비밀번호 재설정 등)
     */
    public void sendVerificationCode(String toEmail, String code, VerificationPurpose purpose) {
        try {
            System.out.println("[메일 전송 시도] → " + toEmail + ", code: " + code + ", purpose: " + purpose);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);

            // 인증 목적에 따라 제목 및 본문 설정
            switch (purpose) {
                case SIGNUP -> {
                    message.setSubject("[CheckTalk] 회원가입 이메일 인증 코드");
                    message.setText(buildEmailBody(code, "회원가입"));
                }
                case PASSWORD_RESET -> {
                    message.setSubject("[CheckTalk] 비밀번호 재설정 인증 코드");
                    message.setText(buildEmailBody(code, "비밀번호 재설정"));
                }
                default -> {
                    message.setSubject("[CheckTalk] 인증 코드 안내");
                    message.setText(buildEmailBody(code, "요청하신 작업"));
                }
            }

            mailSender.send(message);
            System.out.println("[메일 전송 완료]");

        } catch (Exception e) {
            System.err.println("[메일 전송 실패]: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * 인증 메일 본문 생성 유틸 메서드
     *
     * @param code         6자리 인증 코드
     * @param purposeLabel 사용자에게 보여질 인증 목적 설명
     * @return 이메일 본문 텍스트
     */
    private String buildEmailBody(String code, String purposeLabel) {

        LocalDateTime now = LocalDateTime.now();
        String formattedTime = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        return String.format("""
                인증 요청 시간: %s
                
                CheckTalk에서 요청하신 [%s] 작업을 위한 인증 코드는 아래와 같습니다.
                
                인증 코드: %s
                
                본 인증 코드는 발급 시점으로부터 10분간 유효합니다.
                타인에게 노출되지 않도록 주의해주시고, 시간이 지나면 다시 요청해주세요.
                """, formattedTime, purposeLabel, code);
    }

}
