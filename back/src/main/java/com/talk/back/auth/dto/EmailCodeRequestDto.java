package com.talk.back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.talk.back.enums.VerificationPurpose;
import lombok.Getter;
import lombok.Setter;

/**
 * EmailCodeRequestDto
 *
 * 이메일 인증 코드 요청 시 클라이언트가 서버로 전송하는 요청 DTO
 *
 * [역할]
 * - 회원가입 또는 비밀번호 재설정 등에서 이메일 인증 코드를 전송 요청할 때 사용
 * - 서버는 해당 이메일로 인증 코드를 생성 후 전송함
 *
 * [사용 예]
 * - 회원가입 시 본인 이메일 확인
 * - 비밀번호 찾기 시 인증 코드 발송
 */
@Getter
@Setter
public class EmailCodeRequestDto {

    /**
     * 인증 코드를 받을 이메일 주소
     * - 이메일 형식 유효성 검사 필수
     */
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    /**
     * 인증 요청의 목적 (회원가입, 비밀번호 재설정 등)
     * - VerificationPurpose Enum 사용
     * - 반드시 전달되어야 함
     */
    @NotNull(message = "인증 요청 목적을 지정해주세요.")
    private VerificationPurpose purpose;
}
