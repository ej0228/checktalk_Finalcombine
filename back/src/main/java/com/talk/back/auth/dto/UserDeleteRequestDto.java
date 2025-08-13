package com.talk.back.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 사용자가 직접 회원 탈퇴를 요청할 때 사용하는 DTO
 *
 * [사용 시나리오]
 * - 로그인된 사용자가 본인의 계정을 탈퇴하려는 경우
 * - 보안상 본인 확인을 위해 비밀번호를 요구함
 *
 * [처리 방식]
 * - 실제 DB에서 삭제하지 않고, 상태(status)를 DELETED로 변경 (소프트 딜리트)
 * - 이후 로그인 불가, 개인정보도 마스킹하거나 비활성화 상태로 유지
 */
@Getter
@Setter
public class UserDeleteRequestDto {

    /**
     * 사용자 본인 확인용 비밀번호
     * - 탈퇴 시 본인 인증을 위해 요구됨
     */
    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Size(min = 4, message = "비밀번호는 최소 4자 이상이어야 합니다.")
    private String password;
}
