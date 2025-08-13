package com.talk.back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 이메일 인증을 완료한 사용자가 비밀번호를 재설정할 때 사용하는 요청 DTO
 *
 * [사용 시나리오]
 * - 사용자가 기존 비밀번호를 잊은 경우
 * - 인증 이메일(코드)을 통해 본인임이 확인된 후, 새 비밀번호를 등록할 때 사용
 *
 * [검증 흐름]
 * 1. 인증이 완료된 이메일 입력 확인
 * 2. 새 비밀번호 입력 및 길이 제한 (4자 이상)
 * 3. 새 비밀번호 확인과 일치 여부 검사
 */
@Getter
@Setter
public class PasswordResetChangeDto {

    /**
     * 인증을 완료한 사용자 이메일
     * - 해당 이메일을 기준으로 비밀번호가 변경됨
     */
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    /**
     * 새로 설정할 비밀번호
     * - 보안 상 최소 길이 제한 적용
     */
    @NotBlank(message = "새 비밀번호를 입력해주세요.")
    @Size(min = 4, message = "새 비밀번호는 최소 4자 이상이어야 합니다.")
    private String newPassword;

    /**
     * 새 비밀번호 확인 입력란
     * - newPassword와 일치하는지 검증해야 함
     */
    @NotBlank(message = "새 비밀번호 확인을 입력해주세요.")
    private String newPasswordConfirm;
}
