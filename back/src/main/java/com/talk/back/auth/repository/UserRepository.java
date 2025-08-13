// UserRepository.java (레포지토리) - 삭제되지 않은 유저만 조회하도록
package com.talk.back.auth.repository;


import com.talk.back.auth.entity.User;
import com.talk.back.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 조회 (로그인 시 사용)
     * - 탈퇴 여부와 관계없이 조회됨
     */
    Optional<User> findByEmail(String email);

    /**
     * 이메일 존재 여부 확인
     * - 회원가입 시 중복 검사에 사용
     */
    // ✅ 중복검사는 "탈퇴 아님" 조건을 명시
    boolean existsByEmailAndStatusNot(String email, UserStatus status);




    /**
     * 정지된 사용자 중 특정 시간 이전에 마지막으로 로그인한 사용자 목록 조회
     * - 휴면 계정 전환 대상자 선별 시 사용
     */
    List<User> findByStatusAndLastLoginAtBefore(UserStatus status, LocalDateTime cutoffTime);

    /**
     * 신고 횟수가 N회 이상인 사용자 목록 조회
     * - 정지 처리 대상자 선별 시 사용
     */
    List<User> findByStatusAndUserIdIn(UserStatus status, List<Long> userIds);

    /**
     * 이메일 기준으로 가장 최근에 생성된 사용자 조회
     * - 탈퇴 여부와 관계없이 전체 중 가장 최신 가입자 1명
     */
    Optional<User> findTopByEmailOrderByCreatedAtDesc(String email);





    // 관리자 모드 -  삭제되지 않은 사용자 목록을 페이지네이션 형태로 반환 ('N')
    Page<User> findByDeleted(String deleted, Pageable pageable);

    // 관리자 모드 - 단일 사용자 조회 (삭제 안 된 것만 조회)
    Optional<User> findByUserIdAndDeleted(Long userId, String deleted);

    // 관리자 모드 - 페이징 검색
    // 이름 + 삭제 안된 회원만 검색
    Page<User> findByNameContainingAndDeleted(String name, String deleted, Pageable pageable);

    // 이메일 + 삭제 안된 회원만 검색
    Page<User> findByEmailContainingAndDeleted(String email, String deleted, Pageable pageable);
}
