package com.talk.back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.talk.back.enums.VerificationPurpose;
import lombok.Getter;
import lombok.Setter;

/**
 * PasswordResetRequestDto
 *
 * 비밀번호를 분실한 사용자가 인증 코드를 요청할 때 사용하는 요청 DTO 클래스
 * 이메일 입력을 받아 해당 주소로 인증 코드를 전송하기 위한 용도로 사용
 *
 * 유효성 검사:
 * - 이메일은 비어 있으면 안 되고, 올바른 형식이어야 함
 */
@Getter
@Setter
public class PasswordResetRequestDto {

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이어야 합니다.")
    private String email;

    // 이메일 인증 목적 (SIGNUP, PASSWORD_RESET 등)
    private VerificationPurpose purpose;
}
