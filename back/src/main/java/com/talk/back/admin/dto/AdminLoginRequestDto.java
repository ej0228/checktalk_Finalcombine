package com.talk.back.admin.dto;

/**
 * 관리자 로그인 요청 DTO
 * username과 password 전달
 */
public class AdminLoginRequestDto {

    private String username;
    private String password;

    public AdminLoginRequestDto() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
