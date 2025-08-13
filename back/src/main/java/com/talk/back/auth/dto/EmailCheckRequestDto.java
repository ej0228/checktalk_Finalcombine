package com.talk.back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 회원가입 또는 이메일 인증 시, 사용자가 입력한 이메일의 중복 여부를 확인하기 위한 요청 DTO
 *
 * [사용 시나리오]
 * - 회원가입 페이지에서 이메일 중복 여부 확인 버튼을 누를 때
 * - 이메일 인증 코드 발송 전에 이메일 형식과 중복을 사전 검사할 때
 *
 * [처리 방식]
 * - 이메일 형식(@ 포함)을 검증하고, 기존 사용자 데이터베이스에서 사용 중인지 확인
 * - 탈퇴 회원이라면 재가입 허용 (별도 정책 적용 가능)
 */
@Getter
@Setter
public class EmailCheckRequestDto {

    /**
     * 중복 확인을 요청할 이메일 주소
     * - 유효성 검사를 통해 빈 값 및 이메일 형식(@ 포함) 확인
     */
    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;
}
