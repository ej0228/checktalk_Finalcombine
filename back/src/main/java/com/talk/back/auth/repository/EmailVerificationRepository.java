package com.talk.back.auth.repository;

import  com.talk.back.auth.entity.EmailVerification;
import  com.talk.back.enums.VerificationPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 이메일 인증 정보를 조회하는 JPA Repository 인터페이스
 *
 * [역할]
 * - 이메일 + 인증 코드 기준으로 인증 요청 조회
 * - 목적(SIGNUP, PASSWORD_RESET)에 따라 인증 구분
 * - 최신 인증 요청 기록 확인 등
 */
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    /**
     * 특정 이메일 + 목적에 해당하는 가장 최근 인증 요청 조회
     * - 인증 중복 방지 및 유효시간 검증에 활용됨
     *
     * @param email 조회할 이메일 주소
     * @param purpose 인증 요청 목적 (회원가입, 비밀번호 재설정 등)
     * @return Optional<EmailVerification> – 가장 최근 기록 1건
     */
    Optional<EmailVerification> findTopByEmailAndPurposeOrderByIssuedAtDesc(String email, VerificationPurpose purpose);

    /**
     * 이메일 + 인증 코드 + 목적 기반의 인증 요청 단건 조회
     * - 사용자 입력 코드 검증 시 사용
     *
     * @param email 대상 이메일
     * @param code 인증 코드
     * @param purpose 인증 목적
     * @return Optional<EmailVerification> – 유효한 인증 데이터
     */
    Optional<EmailVerification> findByEmailAndCodeAndPurpose(String email, String code, VerificationPurpose purpose);

}
