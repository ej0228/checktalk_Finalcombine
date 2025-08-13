package com.talk.back.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 마이페이지에서 로그인된 사용자가 비밀번호를 변경할 때 사용하는 요청 DTO
 *
 * [사용 시나리오]
 * - 사용자가 현재 비밀번호를 알고 있는 경우
 * - 보안 강화를 위해 주기적으로 비밀번호를 바꾸는 경우
 *
 * [검증 흐름]
 * 1. 현재 비밀번호 입력 확인
 * 2. 새 비밀번호 입력 및 길이 제한 (4자 이상)
 * 3. 새 비밀번호 확인과 일치 여부 검사
 */
@Getter
@Setter
public class PasswordChangeDto {

    /**
     * 현재 비밀번호
     * - 사용자가 현재 계정에 설정한 기존 비밀번호
     * - 서버 측에서 DB에 저장된 암호화된 비밀번호와 비교하여 검증함
     *
     * 유효성 조건:
     * - 비어 있을 수 없음 (@NotBlank)
     */
    @NotBlank(message = "현재 비밀번호를 입력해주세요.")
    private String currentPassword;

    /**
     * 새 비밀번호
     * - 사용자가 새로 설정하고자 하는 비밀번호
     * - 프론트엔드 및 백엔드에서 유효성 검증 수행
     *
     * 유효성 조건:
     * - 비어 있을 수 없음 (@NotBlank)
     * - 최소 4자 이상이어야 함 (@Size(min = 4))
     *
     * ※ 비밀번호 복잡도 정책 적용 시 @Pattern 어노테이션 추가 가능
     */
    @NotBlank(message = "새 비밀번호를 입력해주세요.")
    @Size(min = 4, message = "새 비밀번호는 최소 4자 이상이어야 합니다.")
    private String newPassword;

    /**
     * 새 비밀번호 확인
     * - 사용자가 입력한 새 비밀번호와 동일한지 확인하기 위한 필드
     * - 서버에서는 newPassword와 값이 일치하는지 비교하여 검증
     *
     * 유효성 조건:
     * - 비어 있을 수 없음 (@NotBlank)
     */
    @NotBlank(message = "새 비밀번호 확인을 입력해주세요.")
    private String newPasswordConfirm;
}
