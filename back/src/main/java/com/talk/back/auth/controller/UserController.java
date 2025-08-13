package com.talk.back.auth.controller;

import com.talk.back.auth.dto.LoginRequestDto;
import com.talk.back.auth.dto.UserDeleteRequestDto;
import com.talk.back.auth.dto.UserSignupDto;
import com.talk.back.auth.dto.UserUpdateDto;
import com.talk.back.auth.entity.CustomUserDetails;
import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.auth.service.EmailVerificationService;
import com.talk.back.auth.service.UserService;
import com.talk.back.enums.Role;
import com.talk.back.enums.UserStatus;
import com.talk.back.enums.VerificationPurpose;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final EmailVerificationService emailVerificationService;
    private final AuthenticationManager authenticationManager;

    /**
     * 회원가입
     * - 이메일 중복 + 이메일 인증 완료된 경우만 허용
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupDto signupDto) {
        System.out.println("[UserController::signup] signupDto= " + signupDto);
        final String email = signupDto.getEmail().trim().toLowerCase(); // ✅ 경계에서 정규화
        signupDto.setEmail(email);

        if (userRepository.existsByEmailAndStatusNot(email, UserStatus.DELETED)) {
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }

        boolean verified = emailVerificationService.isVerified(email, VerificationPurpose.SIGNUP);
        if (!verified) {
            return ResponseEntity.badRequest().body("이메일 인증을 먼저 완료해주세요.");
        }

        try {
            userService.signup(signupDto, Role.USER); // ✅ 실제 가입
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (DataIntegrityViolationException e) {
            // 동시성/레이스 케이스에서 DB 유니크가 막을 때
            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
        }
    }

    /**
     * 이메일 중복 확인
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        final String norm = email.trim().toLowerCase(); // ✅ 정규화
        boolean exists = userRepository.existsByEmailAndStatusNot(norm, UserStatus.DELETED);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * 이메일 인증 코드 발송
     */
    @PostMapping("/verify/send")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email").trim().toLowerCase();
        String purpose = request.get("purpose");

        try {
            VerificationPurpose p = VerificationPurpose.valueOf(purpose);
            emailVerificationService.generateAndSaveVerificationCode(email, p);
            return ResponseEntity.ok(Map.of("message", "인증 코드가 이메일로 발송되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("인증 코드 발송 실패: " + e.getMessage());
        }
    }

    /**
     * 이메일 인증 코드 확인
     */
    @PostMapping("/verify/confirm")
    public ResponseEntity<?> confirmVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email").trim().toLowerCase();
        String code = request.get("code");
        String purpose = request.get("purpose");

        try {
            VerificationPurpose p = VerificationPurpose.valueOf(purpose);
            boolean result = emailVerificationService.verifyCode(email, code, p);

            if (result) {
                return ResponseEntity.ok(Map.of("verified", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("verified", false, "message", "코드가 유효하지 않거나 만료되었습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("이메일 인증 확인 실패: " + e.getMessage());
        }
    }

    /**
     * 로그인
     * - 사용자의 이메일/비밀번호로 인증 후, 계정 상태(UserStatus)에 따라 접근 여부 판단
     * - 상태별 처리:
     *   - DELETED: 탈퇴된 회원 → 재가입 요청
     *   - SUSPENDED: 정지된 계정 → 고객센터 문의
     *   - DORMANT: 휴면 계정 → 이메일 인증 후 활성화
     * - 정상 로그인 시 세션에 인증 정보 저장
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto, HttpServletRequest request) {
        try {
            // 최근 가입된 계정 기준으로 사용자 정보 조회
            User user = userService.findLatestUserByEmail(dto.getEmail());

            // 이메일 미존재 처리
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("message", "등록되지 않은 이메일입니다. 회원가입을 해주세요."));
            }

            // 계정 상태 확인
            switch (user.getStatus()) {
                case DELETED:
                    return ResponseEntity.status(410) // Gone
                            .body(Map.of("message", "탈퇴한 계정입니다. 다시 가입해주세요."));
                case SUSPENDED:
                    return ResponseEntity.status(423) // Locked
                            .body(Map.of("message", "정지된 계정입니다. 고객센터로 문의해주세요."));
                case DORMANT:
                    return ResponseEntity.status(428) // Precondition Required
                            .body(Map.of("message", "휴면 계정입니다. 이메일 인증 후 로그인해주세요."));
                case ACTIVE:
                    break;
                default:
                    return ResponseEntity.status(403)
                            .body(Map.of("message", "계정 상태를 확인할 수 없습니다."));
            }

            // Spring Security 인증
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());

            var authentication = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 세션 저장
            request.getSession().setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext()
            );

            // 로그인 응답
            var loginResponse = userService.login(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "userId", loginResponse.getUserId(),
                    "name", loginResponse.getName(),
                    "email", loginResponse.getEmail(),
                    "role", loginResponse.getRole()
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류로 로그인에 실패했습니다."));
        }
    }



    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    /**
     * 마이페이지 정보 조회
     */
    @GetMapping("/mypage")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        return ResponseEntity.ok(userService.getUserInfo(userDetails.getUser().getUserId()));
    }

    /**
     * 사용자 정보 수정
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateDto dto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인 정보 없음");
        }

        userService.updateUser(userDetails.getUser().getUserId(), dto);
        return ResponseEntity.ok("수정 성공!");
    }

    /**
     * 세션 만료 응답 처리
     */
    @GetMapping("/session-expired")
    public ResponseEntity<String> sessionExpired() {
        return ResponseEntity.status(401).body("세션이 만료되었습니다.");
    }

    /**
     * 회원 탈퇴
     * - 비밀번호 확인 후 탈퇴 처리
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @RequestBody @Valid UserDeleteRequestDto dto,
                                        HttpSession session) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        try {
            userService.deleteUser(userDetails.getUser().getUserId(), dto);
            session.invalidate();
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok("탈퇴가 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
