package com.talk.back.auth.dto;

import com.talk.back.enums.*;
import lombok.*;

import java.time.LocalDate;

/**
 * 회원가입 요청 시 클라이언트가 서버로 전달하는 데이터 구조 (Request DTO)
 *
 * [역할]
 * - 사용자가 입력한 가입 정보를 서버로 전달
 * - 서버는 이 데이터를 기반으로 User 엔티티로 변환 및 저장 처리
 *
 * [보안 주의]
 * - 비밀번호는 암호화 후 저장해야 하며, 클라이언트에서 평문으로 전송되는 점 고려
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserSignupDto {

    /**
     * 로그인 ID로 사용할 이메일
     * - 중복 확인 필요
     * - 이메일 인증 이후에만 계정 생성 가능
     */
    private String email;

    /**
     * 사용자 비밀번호
     * - 최소 4자 이상
     * - 서버 저장 전 반드시 암호화 필요
     */
    private String password;

    /**
     * 사용자 이름
     * - 실명 또는 닉네임 형태
     */
    private String name;

    /**
     * 사용자 휴대전화 번호
     * - 인증 또는 계정 복구용
     */
    private String phone;

    /**
     * 생년월일
     * - yyyy-MM-dd 형식
     */
    private LocalDate birthDate;

    /**
     * 성별
     * - MALE / FEMALE 값만 허용됨
     */
    private Gender gender;

    /**
     * 직업 유형
     * - STUDENT, OFFICE_WORKER, FREELANCER, ETC 중 선택
     */
    private JobType job;

    /**
     * 관심 주제
     * - COUNSELING, RELATIONSHIP, PRESENTATION 등
     */
    private InterestType interest;

    /**
     * 서비스 사용 목적
     * - SELF_ANALYSIS, COUNSELING_TOOL, SCHOOL_PROJECT 등
     */
    private PurposeType usagePurpose;

    /**
     * 커뮤니케이션 목표
     * - 사용자가 자유롭게 입력
     * - 상담 목표나 말하기 개선 목표 등
     */
    private String communicationGoal;
}
