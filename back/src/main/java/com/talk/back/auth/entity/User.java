// 관리자 모드 - 회원 관리 기능용 소프트 딜리트 구현 파일
// 소프트 딜리트란?
// 실제 DB에서 레코드를 삭제하지 않고 `deleted` 플래그('Y'/'N')를 이용해 숨김 처리
// "삭제됨처럼 보이지만 복구 가능", 이력 보존 및 감사 로그 목적에도 활용 가능
// 공유 대상: 사용자 기능 담당자, 관리자 페이지 담당자

package com.talk.back.auth.entity;

import com.talk.back.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;



/**
 * 사용자 정보를 저장하는 JPA 엔티티 클래스
 * - users 테이블과 매핑됨
 *
 * [기능 설명]
 * - 로그인에 필요한 이메일과 암호화된 비밀번호 저장
 * - 이름, 전화번호, 생년월일 등 기본 개인정보 저장
 * - 권한(Role), 계정 상태(UserStatus), 이메일 인증 상태 등 사용자 접근 관리 정보 포함
 * - 계정 생성일, 마지막 로그인일 등 사용자 활동 기록 추적 가능
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * 사용자 고유 식별자 (Primary Key)
     * - 자동 증가 방식 사용
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;


    // -------------------- 인증 및 로그인 관련 필드 --------------------

    /**
     * 로그인에 사용하는 이메일 주소
     * - 고유해야 하며 중복 불가
     * - 로그인 ID 역할 수행
     */
    @Column(nullable = false, unique = true, length = 100)
    private String email;


    /**
     * 로그인 비밀번호
     * - 반드시 BCrypt 등으로 암호화된 상태로 저장됨
     * - 응답 객체 또는 토큰에 포함되어선 안 됨
     */
    @Column(nullable = false, length = 255)
    private String password;




    /**
     * 이메일 인증 완료 여부
     * - 인증 메일을 통해 인증 완료 시 true로 설정됨
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;

    /**
     * 이메일 인증이 완료된 시각
     * - 감사 로그 또는 유효성 확인 용도로 사용
     */
    private LocalDateTime emailVerifiedAt;

    /**
     * 마지막 로그인 시각
     * - 로그인 성공 시 서버에서 자동 갱신됨
     * - 휴면 계정 전환 기준으로 활용
     */
    @Column
    private LocalDateTime lastLoginAt;

    // -------------------- 사용자 개인정보 --------------------


    /**
     * 사용자 실명
     * - 회원가입 시 필수 입력
     */
    @Column(nullable = false, length = 50)
    private String name;


    /**
     * 휴대전화 번호
     * - '-' 포함 여부는 클라이언트 입력 처리에 위임
     * - 인증, 계정 복구 등에서 사용
     */
    @Column(length = 20, nullable = false)
    private String phone;


    /**
     * 생년월일
     * - yyyy-MM-dd 형식
     * - 나이 계산 또는 통계 목적
     */
    @Column(nullable = false)
    private LocalDate birthDate;


    /**
     * 성별
     * - MALE / FEMALE
     */
    @Column(nullable = false, length = 10)
    private Gender gender;

    /**
     * 직업 유형
     * - 예: STUDENT, OFFICE_WORKER, FREELANCER, ETC
     */
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private JobType job;

    /**
     * 관심 주제
     * - COUNSELING, RELATIONSHIP, PRESENTATION 등
     */
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private InterestType interest;


    /**
     * 서비스 사용 목적
     * - SELF_ANALYSIS, COUNSELING_TOOL 등
     */
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private PurposeType usagePurpose;


    /**
     * 커뮤니케이션 목표
     * - 상담 목표나 말하기 개선 목표 등 사용자 자율 입력
     */
    @Column(length = 255)
    private String communicationGoal;



    // -------------------- 접근 제어 관련 필드 --------------------

    /**
     * 사용자 권한
     * - USER (기본값), ADMIN
     * - 접근 권한 판단 기준
     */
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    /**
     * 사용자 계정 상태
     * - ACTIVE: 정상
     * - DELETED: 탈퇴
     * - SUSPENDED: 정지
     * - DORMANT: 휴면
     */
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    // -------------------- 시스템 메타 정보 --------------------

    /**
     * 계정 생성 시각
     * - 최초 저장 시 자동 설정됨
     */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /**
     * 최초 저장 시 createdAt 값을 현재 시간으로 자동 설정
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


    // [소프트 딜리트 적용 필드]
    // 'N' : 정상 사용자 (기본값)
    // 'Y' : 삭제된 사용자 (관리자 목록에서는 제외됨)
    @Builder.Default
    @Column(nullable = false, length = 1)
    private String deleted = "N";

    //관리자모드 - 분석기록용
    public Long getId() {
        return userId;
    }



    // -------------------- 유틸 메서드 --------------------

    /**
     * 현재 사용자가 관리자 권한인지 여부 확인
     *
     * @return true: 관리자, false: 일반 사용자
     */
    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

}
