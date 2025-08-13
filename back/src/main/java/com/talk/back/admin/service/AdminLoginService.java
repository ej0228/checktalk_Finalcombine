package com.talk.back.admin.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import com.talk.back.admin.dto.AdminLoginRequestDto;
import com.talk.back.admin.dto.AdminLoginResponseDto;
import com.talk.back.admin.entity.AdminUser;
import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.admin.repository.AdminUserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminLoginService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminLogService adminLogService;

    public AdminLoginService(AdminUserRepository adminUserRepository,
                             PasswordEncoder passwordEncoder,
                             AdminLogService adminLogService) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminLogService = adminLogService;
    }

    /**
     * 관리자 로그인 처리 및 인증 세션 저장
     * @param dto 로그인 요청 정보 (username, password)
     * @return AdminLoginResponseDto (username + role)
     * @throws IllegalArgumentException 유효하지 않은 경우 예외 발생
     */
    public AdminLoginResponseDto login(AdminLoginRequestDto dto, HttpServletRequest request) {
        Optional<AdminUser> optionalAdmin = adminUserRepository.findByUsername(dto.getUsername());

        if (optionalAdmin.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 관리자 계정입니다.");
        }

        AdminUser admin = optionalAdmin.get();

        // 비밀번호 불일치
        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 역할 검사 (관리자가 아닌 경우)
        if (!"ADMIN".equalsIgnoreCase(admin.getRole())) {
            throw new IllegalArgumentException("관리자가 아닙니다.");
        }

        // Spring Security 인증 객체 생성
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        admin.getUsername(), null,
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        // 세션에 인증 정보 저장
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", context);

        // 관리자 활동 로그 기록 (✅ enum 사용)
        adminLogService.saveLog(AdminLogType.LOGIN, admin.getUsername());

        // 응답 반환
        return new AdminLoginResponseDto(admin.getUsername(), admin.getRole());
    }
}
