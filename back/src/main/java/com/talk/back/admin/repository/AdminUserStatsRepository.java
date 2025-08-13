package com.talk.back.admin.repository;

import com.talk.back.admin.dto.AdminDailyUserStatDto;
import com.talk.back.auth.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * [Repository - native query로 가입자 추이 통계 조회]
 * - DATE_FORMAT으로 날짜를 'MM/dd' 포맷으로 변환
 * - GROUP BY와 SELECT를 동일하게 맞춰 only_full_group_by 오류 해결
 * - 결과는 UserStatDto 인터페이스로 바로 매핑
 */
@Repository
public interface AdminUserStatsRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT DATE_FORMAT(created_at, '%m/%d') AS date, COUNT(*) AS users " +
            "FROM users GROUP BY DATE_FORMAT(created_at, '%m/%d') ORDER BY DATE_FORMAT(created_at, '%m/%d')",
            nativeQuery = true)
    List<AdminDailyUserStatDto> countUsersGroupedByDate();
}
