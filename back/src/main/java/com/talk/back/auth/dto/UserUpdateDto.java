package com.talk.back.auth.dto;

import com.talk.back.enums.*;
import lombok.*;

import java.time.LocalDate;

/**
 * 사용자 정보 수정 요청을 처리하는 DTO 클래스
 *
 * [역할]
 * - 마이페이지 또는 설정 화면에서 사용자가 입력한 정보 수정 요청을 담는 객체
 * - 서버에서는 이 데이터를 기반으로 기존 User 엔티티 값을 갱신
 *
 * [주의사항]
 * - 비밀번호 및 이메일은 이 DTO로 수정하지 않음
 * - 인증이 필요한 민감 정보는 서버 측에서 권한 확인 후 처리해야 함
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDto {

    /**
     * 사용자 연락처 (휴대폰 번호)
     * - "-" 포함 여부는 클라이언트에서 처리
     * - 비어 있으면 저장하지 않도록 서비스 로직에서 검증 필요
     */
    private String phone;

    /**
     * 생년월일
     * - yyyy-MM-dd 형식
     * - 일부 서비스에서 연령 기반 기능 제공 시 사용 가능
     */
    private LocalDate birthDate;

    /**
     * 성별
     * - MALE 또는 FEMALE 값 중 하나
     */
    private Gender gender;

    /**
     * 직업 유형
     * - STUDENT, OFFICE_WORKER, FREELANCER, ETC 등
     */
    private JobType job;

    /**
     * 관심 주제
     * - COUNSELING, TEAMWORK, RELATIONSHIP 등 선택형
     */
    private InterestType interest;

    /**
     * 서비스 사용 목적
     * - 예: SELF_ANALYSIS, SCHOOL_PROJECT, COUNSELING_TOOL 등
     */
    private PurposeType usagePurpose;

    /**
     * 커뮤니케이션 목표
     * - 사용자가 자유롭게 입력한 상담 또는 말하기 목표
     */
    private String communicationGoal;
}
