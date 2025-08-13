package com.talk.back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.talk.back.enums.VerificationPurpose;
import lombok.Getter;
import lombok.Setter;

/**
 * EmailCodeVerifyDto
 *
 * 사용자가 입력한 이메일 인증 코드를 검증할 때 사용하는 DTO 클래스
 *
 * [역할]
 * - 이메일, 인증 코드, 인증 목적을 받아 인증 상태를 검증
 *
 * [사용 예]
 * - 회원가입 완료 전 이메일 인증
 * - 비밀번호 재설정 시 인증 코드 확인
 */
@Getter
@Setter
public class EmailCodeVerifyDto {

    /**
     * 인증을 시도하는 이메일 주소
     */
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    /**
     * 사용자가 입력한 인증 코드 (6자리)
     */
    @NotBlank(message = "인증 코드를 입력해주세요.")
    private String code;

    /**
     * 인증 요청 목적 (회원가입, 비밀번호 재설정 등)
     */
    @NotNull(message = "인증 목적을 입력해주세요.")
    private VerificationPurpose purpose;
}
