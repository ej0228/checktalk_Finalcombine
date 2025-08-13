package com.talk.back.auth.service;


import com.talk.back.admin.entity.AdminUserLogType;
import com.talk.back.admin.service.AdminUserLogService;
import com.talk.back.auth.dto.*;
import com.talk.back.auth.entity.EmailVerification;
import com.talk.back.auth.entity.User;
import com.talk.back.auth.entity.UserStatusLog;
import com.talk.back.auth.repository.EmailVerificationRepository;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.auth.repository.UserStatusLogRepository;
import com.talk.back.enums.Role;
import com.talk.back.enums.UserStatus;
import com.talk.back.enums.VerificationPurpose;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;



/**
 * 사용자 관련 핵심 비즈니스 로직을 담당하는 서비스 클래스
 *
 * [기능]
 * - 회원가입, 로그인, 정보 조회 및 수정
 * - 비밀번호 변경 및 재설정 (※ 인증 기반은 PasswordResetService에서 분리 처리)
 * - 이메일 중복 확인
 * - 회원 탈퇴 및 상태 변경
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final UserStatusLogRepository userStatusLogRepository;
    private final PasswordEncoder passwordEncoder;
    //관리자모드 : 사용자 로그인 로그용
    private final AdminUserLogService adminUserLogService;



    /**
     * 회원가입 처리
     * - 이메일 중복 및 인증 여부 확인 후 계정 생성
     */
    @Transactional
    public void signup(UserSignupDto dto, Role role) {

        String email = dto.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailAndStatusNot(email, UserStatus.DELETED)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }


        EmailVerification verification = emailVerificationRepository
                .findTopByEmailAndPurposeOrderByIssuedAtDesc(dto.getEmail(), VerificationPurpose.SIGNUP)
                .orElseThrow(() -> new IllegalStateException("이메일 인증 이력이 없습니다."));

        if (!verification.isVerified()) {
            throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .phone(dto.getPhone())
                .birthDate(dto.getBirthDate())
                .gender(dto.getGender())
                .job(dto.getJob())
                .interest(dto.getInterest())
                .usagePurpose(dto.getUsagePurpose())
                .communicationGoal(dto.getCommunicationGoal())
                .role(role)
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .emailVerifiedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    /**
     * 이메일로 가장 최근에 가입된 사용자 조회
     * - 동일 이메일 재가입 가능성을 고려하여 createdAt 기준 최신 사용자 반환
     */
    public User findLatestUserByEmail(String email) {
        return userRepository.findTopByEmailOrderByCreatedAtDesc(email).orElse(null);
    }

    /**
     * 로그인 처리
     * - 이메일 존재 여부 및 비밀번호 일치 여부 확인
     * - 계정 상태에 따라 로그인 허용 여부 분기
     * - 정상 로그인 시 사용자 정보 DTO 반환
     */
    public LoginResponseDto login(LoginRequestDto dto) {
        // 이메일로 사용자 조회 (가장 최근 가입 기준)
        User user = userRepository.findTopByEmailOrderByCreatedAtDesc(dto.getEmail())
                .orElseThrow(() -> new BadCredentialsException("존재하지 않는 이메일입니다."));

        // 계정 상태 확인 (ACTIVE가 아닌 경우 즉시 예외 발생)
        UserStatus status = user.getStatus();
        switch (status) {
            case DORMANT:
                throw new IllegalStateException("휴면 계정입니다. 인증 후 활성화해주세요.");
            case SUSPENDED:
                throw new IllegalStateException("정지된 계정입니다. 고객센터에 문의해주세요.");
            case DELETED:
                throw new IllegalStateException("탈퇴한 계정입니다. 다시 가입해주세요.");
            case ACTIVE:
                // 계정 상태가 정상일 때만 비밀번호 검사
                if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                    throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
                }

                // 로그인 성공 응답 반환
                return new LoginResponseDto(
                        true,
                        "로그인 성공",
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        UserDto.from(user)
                );
            default:
                throw new IllegalStateException("알 수 없는 계정 상태입니다.");
        }

    }






    /**
     * 이메일로 사용자 조회
     *
     * @param email 이메일
     * @return User 엔티티
     * @throws IllegalArgumentException 존재하지 않는 경우 예외 발생
     */
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일로 등록된 사용자를 찾을 수 없습니다."));
    }

    /**
     * 마이페이지 정보 조회
     * - 사용자 ID로 사용자 정보를 조회하고 DTO로 변환하여 반환
     */
    public UserDto getUserInfo(Long userId) {
        return userRepository.findById(userId)
                .map(UserDto::from)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
    }

    /**
     * 마이페이지 정보 수정
     * - 사용자 ID로 사용자 엔티티를 조회하고 입력된 값으로 필드를 업데이트
     */
    @Transactional
    public void updateUser(Long userId, UserUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        user.setPhone(dto.getPhone());
        user.setBirthDate(dto.getBirthDate());
        user.setGender(dto.getGender());
        user.setJob(dto.getJob());
        user.setInterest(dto.getInterest());
        user.setUsagePurpose(dto.getUsagePurpose());
        user.setCommunicationGoal(dto.getCommunicationGoal());
    }

    /**
     * 비밀번호 변경
     * - 현재 비밀번호를 확인한 뒤, 새 비밀번호로 변경 (※ 마이페이지 내 기능)
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

    /**
     * 회원 탈퇴 (소프트 딜리트)
     * - 사용자 상태를 DELETED로 변경하여 시스템 접근 제한
     */
    @Transactional
    public void deleteUser(Long userId, UserDeleteRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        user.setStatus(UserStatus.DELETED);
        user.setDeleted("Y");
    }

    /**
     * 사용자 상태 변경 및 상태 변경 로그 기록
     * - 상태 전환 및 변경 이력을 저장함
     */
    @Transactional
    public void changeUserStatus(User user, UserStatus newStatus, String reason) {
        UserStatus before = user.getStatus();
        user.setStatus(newStatus);

        UserStatusLog log = UserStatusLog.builder()
                .user(user)
                .fromStatus(before)
                .toStatus(newStatus)
                .changedBy("SYSTEM")
                .changedAt(LocalDateTime.now())
                .build();

        userStatusLogRepository.save(log);
    }

    /**
     * 이메일 중복 여부 확인
     * - 회원가입 시 이메일이 이미 존재하는지 확인
     *
     * @param email 중복 확인할 이메일
     * @throws IllegalArgumentException 중복된 경우 예외 발생
     */
    public void checkEmailDuplication(String email) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            if (existingUser.get().getStatus() != UserStatus.DELETED) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
        }
    }




    // 관리자모드 - 로그인 검증
    public User login(String email, String password, String ipAddress) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("해당 이메일의 회원이 존재하지 않습니다.");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // ✅ 로그인 성공 시 사용자 로그 기록
        adminUserLogService.saveLog(user.getId(), AdminUserLogType.LOGIN, ipAddress);

        return user;
    }
}
