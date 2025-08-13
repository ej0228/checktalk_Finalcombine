package com.talk.back.auth.service;

import com.talk.back.auth.dto.PasswordChangeDto;
import com.talk.back.auth.dto.PasswordResetChangeDto;
import com.talk.back.auth.entity.EmailVerification;
import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.EmailVerificationRepository;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.enums.VerificationPurpose;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * PasswordResetService
 *
 * 비밀번호 재설정 및 변경 기능을 모두 처리하는 서비스 클래스
 *
 * [역할]
 * - 이메일 인증 완료 후 비밀번호 재설정 처리
 * - 마이페이지에서 현재 비밀번호 확인 후 비밀번호 변경 처리
 */
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationRepository emailVerificationRepository;


    public boolean verifyCurrentPassword(Long userId, String currentPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return passwordEncoder.matches(currentPassword, user.getPassword());
    }

    /**
     * 이메일 인증 완료 후 비밀번호 재설정 처리
     *
     * @param dto 이메일과 새 비밀번호 DTO
     * @throws IllegalArgumentException 이메일이 존재하지 않거나 비밀번호가 일치하지 않을 경우
     */
    @Transactional
    public void resetPassword(PasswordResetChangeDto dto) {
        // 이메일 정규화
        String normalizedEmail = dto.getEmail().trim().toLowerCase();

        if (!dto.getNewPassword().equals(dto.getNewPasswordConfirm())) {
            throw new IllegalArgumentException("새 비밀번호와 확인이 일치하지 않습니다.");
        }

        // 1) 최근 인증 기록 확인
        EmailVerification verification = emailVerificationRepository
                .findTopByEmailAndPurposeOrderByIssuedAtDesc(
                        normalizedEmail,
                        VerificationPurpose.PASSWORD_RESET
                )
                .orElseThrow(() -> new IllegalArgumentException("인증 기록을 찾을 수 없습니다."));

        // 2) 인증 여부 + 만료시간 재확인
        if (!verification.isVerified()) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("인증이 만료되었습니다. 다시 요청해주세요.");
        }

        // 3) 사용자 조회
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일로 등록된 사용자를 찾을 수 없습니다."));

        // 4) 비밀번호 변경
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        // 5) 인증 상태 소모 처리
        verification.setVerified(false);
    }


    /**
     * 마이페이지에서 비밀번호 변경 처리
     *
     * @param userId 로그인된 사용자 ID
     * @param dto 현재 비밀번호 및 새 비밀번호 DTO
     * @throws IllegalArgumentException 현재 비밀번호 불일치 또는 새 비밀번호 불일치
     */
    @Transactional
    public void changePassword(Long userId, PasswordChangeDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (!dto.getNewPassword().equals(dto.getNewPasswordConfirm())) {
            throw new IllegalArgumentException("새 비밀번호와 확인이 일치하지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }

}
