package com.talk.back.enums;

/**
 * 이메일 인증 요청의 목적을 정의하는 열거형
 * - SIGNUP: 회원가입
 * - PASSWORD_RESET: 비밀번호 재설정
 */
public enum VerificationPurpose {
    SIGNUP,         // 회원가입 시 인증
    PASSWORD_RESET  // 비밀번호 재설정 시 인증
}
