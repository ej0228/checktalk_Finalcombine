package com.talk.back.auth.controller;

import jakarta.validation.Valid;
import com.talk.back.auth.dto.PasswordChangeDto;
import com.talk.back.auth.dto.PasswordResetChangeDto;
import com.talk.back.auth.entity.CustomUserDetails;
import com.talk.back.auth.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * PasswordResetController
 *
 * 비밀번호 재설정 및 변경 요청을 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/users/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * 현재 비밀번호 검증 요청
     *
     * [용도]
     * - 로그인된 사용자가 마이페이지에서 비밀번호를 변경하기 전에
     *   기존 비밀번호가 맞는지 서버 측에서 검증하는 용도
     *
     * [요청]
     * - 헤더: 인증된 사용자 세션 포함 (@AuthenticationPrincipal)
     * - 바디: Map<String, String> 형식으로 currentPassword 전달
     *
     * [응답]
     * - 성공: { "valid": true } 또는 { "valid": false } 형태로 반환
     * - 비로그인 상태: 401 Unauthorized 응답 반환
     *
     * @param body 클라이언트로부터 전달된 요청 본문 (currentPassword 포함)
     * @param userDetails 인증된 사용자 정보 (Spring Security)
     * @return 현재 비밀번호의 일치 여부 결과 (true / false)
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCurrentPassword(@RequestBody Map<String, String> body,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String currentPassword = body.get("currentPassword");
        boolean valid = passwordResetService.verifyCurrentPassword(userDetails.getUser().getUserId(), currentPassword);

        return ResponseEntity.ok(Map.of("valid", valid));
    }

    /**
     * 이메일 인증 완료 후 비밀번호 재설정 처리
     */
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid PasswordResetChangeDto dto) {
        try {
            passwordResetService.resetPassword(dto);
            return ResponseEntity.ok("비밀번호가 재설정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 비밀번호 변경 요청을 처리하는 컨트롤러 메서드
     *
     * <p><b>[사용 조건]</b><br>
     * - 사용자는 로그인 상태여야 하며, 요청 본문에 현재 비밀번호와 새 비밀번호 정보를 담아야 함<br>
     * - `PasswordChangeDto`에는 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인이 포함됨
     *
     * <p><b>[처리 흐름]</b><br>
     * 1. 로그인된 사용자 정보가 없으면 401 Unauthorized 반환<br>
     * 2. 비밀번호 변경 서비스(`PasswordResetService.changePassword`) 호출<br>
     * 3. 성공 시 200 OK와 함께 성공 메시지 반환
     *
     * @param dto 비밀번호 변경 요청 DTO (현재 비밀번호, 새 비밀번호, 새 비밀번호 확인)
     * @param userDetails 로그인한 사용자 정보 (Spring Security의 @AuthenticationPrincipal 사용)
     * @return 비밀번호 변경 성공 또는 실패에 대한 HTTP 응답
     */
    @PostMapping("/change")
    public ResponseEntity<?> changePassword(@RequestBody @Valid PasswordChangeDto dto,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        passwordResetService.changePassword(userDetails.getUser().getUserId(), dto);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }
}
