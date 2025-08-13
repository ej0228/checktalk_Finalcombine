package com.talk.back.admin.controller;


import jakarta.servlet.http.HttpServletRequest;
import com.talk.back.admin.dto.AdminLoginRequestDto;
import com.talk.back.admin.dto.AdminLoginResponseDto;
import com.talk.back.admin.service.AdminLoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 관리자 로그인 요청을 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/admin")
public class AdminLoginController {

    private final AdminLoginService adminLoginService;

    public AdminLoginController(AdminLoginService adminLoginService) {
        this.adminLoginService = adminLoginService;
    }

    /**
     * 관리자 로그인 엔드포인트
     * @param dto 관리자 로그인 요청 (username, password)
     * @return 성공 시 AdminLoginResponseDto / 실패 시 message JSON
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequestDto dto, HttpServletRequest request) {
        // 여기! 실제 요청 본문이 잘 들어왔는지 확인(디버깅용: 입력값 확인)
        System.out.println("🔍 [AdminLoginController] username: " + dto.getUsername());
        System.out.println("🔍 [AdminLoginController] password: " + dto.getPassword());

        // 이후 서비스 호출
        try {
            AdminLoginResponseDto response = adminLoginService.login(dto, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            //실패 시 JSON 형태로 오류 메시지 전달
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
