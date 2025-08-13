package com.talk.back.admin.dto;

/**
 * 관리자 로그인 응답 DTO
 * 로그인 성공 시 클라이언트에게 username과 역할 정보를 전달
 */
public class AdminLoginResponseDto {

    private String username;
    private String role;

    public AdminLoginResponseDto() {}

    public AdminLoginResponseDto(String username, String role) {
        this.username = username;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
