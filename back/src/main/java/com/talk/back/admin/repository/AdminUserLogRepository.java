package com.talk.back.admin.repository;

import com.talk.back.admin.dto.AdminUserLogDto;
import com.talk.back.admin.entity.AdminUserLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AdminUserLogRepository extends JpaRepository<AdminUserLog, Long> {

    /**
     * 사용자 이름 + 날짜 범위 필터링 + DTO 직접 매핑 (페이징 포함)
     */
    @Query("""
        SELECT new com.talk.back.admin.dto.AdminUserLogDto(
            l.id,
            u.id,
            u.name,
            l.ipAddress,
            l.actionTime
        )
        FROM AdminUserLog l
        JOIN com.talk.back.auth.entity.User u ON l.userId = u.id
        WHERE (:name IS NULL OR u.name LIKE %:name%)
          AND (:start IS NULL OR l.actionTime >= :start)
          AND (:end IS NULL OR l.actionTime <= :end)
        ORDER BY l.actionTime DESC
    """)
    Page<AdminUserLogDto> findProjectedLogs(
            @Param("name") String name,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );
}
