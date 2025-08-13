package com.talk.back.auth.dto;

import com.talk.back.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 로그인 요청 처리 결과를 클라이언트에 전달하는 응답 DTO
 *
 * [역할]
 * - 로그인 성공 여부 및 사용자 정보를 클라이언트로 전달
 * - 로그인 이후 UI 렌더링이나 권한 판단에 활용됨
 *
 * [사용 예]
 * - 로그인 성공 시 사용자 정보를 포함한 응답 반환
 * - 로그인 실패 시 실패 메시지를 포함한 응답 반환
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

    /**
     * 로그인 성공 여부
     * - true: 로그인 성공
     * - false: 로그인 실패
     */
    private boolean success;

    /**
     * 로그인 결과 메시지
     * - 예: "로그인 성공", "비밀번호가 일치하지 않습니다." 등
     */
    private String message;

    /**
     * 사용자 식별자 (Primary Key)
     * - 로그인 성공 시에만 포함됨
     */
    private Long userId;

    /**
     * 사용자 이름
     * - 로그인 성공 시에만 포함됨
     */
    private String name;

    /**
     * 사용자 이메일 (로그인 ID)
     */
    private String email;

    /**
     * 사용자 권한
     * - USER / ADMIN 등
     */
    private Role role;

    /**
     * 사용자 상세 정보 DTO
     * - 마이페이지 또는 권한 기반 분기처리에 사용 가능
     */
    private UserDto user;

}
