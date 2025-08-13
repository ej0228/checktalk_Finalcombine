package com.talk.back.auth.repository;


import  com.talk.back.auth.entity.User;
import  com.talk.back.auth.entity.UserStatusLog;
import  com.talk.back.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * UserStatusLogRepository
 * - 사용자 상태 변경 이력을 조회 및 저장하는 리포지토리
 * - 관리자 페이지에서 상태 이력 확인 또는 필터링에 사용
 */
public interface UserStatusLogRepository extends JpaRepository<UserStatusLog, Long> {

    /**
     * 특정 사용자에 대한 모든 상태 변경 이력 조회
     * - 관리자 상세 페이지에서 사용자 상태 이력 출력 시 사용
     */
    List<UserStatusLog> findByUser(User user);

    /**
     * 특정 상태로 변경된 사용자 목록 이력 조회
     * - 예: 최근 정지 처리된 사용자들 확인
     */
    List<UserStatusLog> findByToStatus(UserStatus changedStatus);
}

