package com.talk.back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 사용자 로그인 요청 시 클라이언트로부터 전달받는 요청 DTO
 *
 * [역할]
 * - 로그인 폼에서 입력한 이메일과 비밀번호를 서버로 전달
 * - 서버는 이 DTO를 기반으로 로그인 인증 처리 수행
 *
 * [주의사항]
 * - 이메일과 비밀번호는 모두 필수 입력값으로 유효성 검사를 수행해야 함
 */
@Getter
@Setter
public class LoginRequestDto {

    /**
     * 로그인에 사용하는 이메일
     * - 사용자 계정의 고유 식별자
     * - 이메일 형식 유효성 검사 적용
     */
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    /**
     * 로그인 비밀번호
     * - 암호화되지 않은 평문 상태로 전달되며, 서버에서 암호화 비교 처리
     */
    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;
}
