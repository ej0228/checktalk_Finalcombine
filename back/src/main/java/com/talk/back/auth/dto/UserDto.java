package com.talk.back.auth.dto;

import com.talk.back.auth.entity.User;
import com.talk.back.enums.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;



/**
 * 사용자 정보를 외부로 전달할 때 사용하는 응답 전용 DTO
 *
 * [역할]
 * - 로그인 응답, 마이페이지, 관리자 유저 목록 등에서 사용자 정보를 전달할 때 사용
 * - 보안상 User 엔티티를 직접 노출하지 않기 위해 별도로 분리
 *
 * [주의사항]
 * - 민감한 정보(비밀번호 등)는 포함하지 않음
 * - 일반 사용자가 확인할 수 있는 범위로만 구성됨
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    /**
     * 사용자 고유 식별자 (Primary Key)
     */
    private Long userId;

    /**
     * 로그인에 사용되는 이메일
     * - 사용자의 고유 계정 ID 역할
     */
    private String email;

    /**
     * 사용자 이름
     * - 마이페이지 등에서 표시용으로 사용
     */
    private String name;

    /**
     * 휴대전화 번호
     * - 마스킹 또는 비공개 처리를 통해 제한적으로 전달
     */
    private String phone;

    /**
     * 생년월일
     * - 일부 사용자 정보 조회 또는 통계에서 사용
     */
    private LocalDate birthDate;

    /**
     * 성별
     * - MALE / FEMALE
     */
    private Gender gender;

    /**
     * 직업
     * - STUDENT, OFFICE_WORKER, FREELANCER 등
     */
    private JobType job;

    /**
     * 관심 주제
     * - COUNSELING, RELATIONSHIP, TEAMWORK 등
     */
    private InterestType interest;

    /**
     * 사용 목적
     * - SELF_ANALYSIS, COUNSELING_TOOL 등
     */
    private PurposeType usagePurpose;

    /**
     * 커뮤니케이션 목표 (자유 입력)
     */
    private String communicationGoal;

    /**
     * 가입 일시
     * - 사용자 계정 생성일
     */
    private LocalDateTime createdAt;

    /**
     * 사용자 권한
     * - USER: 일반 사용자
     * - ADMIN: 관리자
     */
    private Role role;

    /**
     * User 엔티티를 UserDto로 변환하는 정적 메서드
     *
     * @param user User 엔티티 객체
     * @return UserDto 응답 객체
     */
    public static UserDto from(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .job(user.getJob())
                .interest(user.getInterest())
                .usagePurpose(user.getUsagePurpose())
                .communicationGoal(user.getCommunicationGoal())
                .createdAt(user.getCreatedAt())
                .role(user.getRole())
                .build();
    }
}