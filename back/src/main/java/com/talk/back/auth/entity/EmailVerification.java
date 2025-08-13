package com.talk.back.auth.entity;

import jakarta.persistence.*;
import com.talk.back.enums.VerificationPurpose;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 이메일 인증 정보를 저장하는 JPA 엔티티 클래스
 *
 * - 이 테이블은 특정 이메일 주소에 대한 인증 요청 및 검증 상태를 기록함
 * - 회원가입, 비밀번호 재설정 등 이메일 인증이 필요한 모든 상황에서 활용 가능
 * - 인증 코드는 유효 시간(expireAt)을 기준으로 만료 처리됨
 *
 * 사용 예시
 * - 회원가입 시: 인증 코드 발급 및 검증
 * - 비밀번호 재설정: 이메일 본인 확인
 * - 이메일 변경 요청 시: 수신 이메일 유효성 검증
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerification {

    /**
     * 고유 ID (기본 키, 자동 증가)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 인증 요청 대상 이메일 주소
     * - 회원가입, 비밀번호 찾기 등 인증을 받을 이메일
     * - 중복 발급 허용 (기록은 여러 개 저장 가능)
     */
    private String email;

    /**
     * 인증 목적 (예: 회원가입, 비밀번호 재설정 등)
     * - SIGNUP, PASSWORD_RESET 등 enum으로 구분
     */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VerificationPurpose purpose;

    /**
     * 발급된 인증 코드
     * - 숫자 또는 문자 6자리 등
     * - 프론트에서 사용자에게 입력받아 검증 시 사용됨
     */
    private String code;

    /**
     * 인증 코드 발급 시각
     * - 인증 코드 유효기간을 계산할 때 기준이 됨
     */
    private LocalDateTime issuedAt;

    /**
     * 인증 코드 만료 시각
     * - 기본 정책: 발급 후 10분
     * - 이 시각 이후의 요청은 무효 처리됨
     */
    private LocalDateTime expiresAt;

    /**
     * 인증 성공 여부
     * - false (기본값): 인증되지 않음
     * - true: 사용자가 입력한 코드로 인증 완료됨
     */
    private boolean verified;
}
