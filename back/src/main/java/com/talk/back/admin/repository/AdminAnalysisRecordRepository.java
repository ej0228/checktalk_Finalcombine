package com.talk.back.admin.repository;

import com.talk.back.admin.dto.AdminDailyCountDto;
import com.talk.back.analysis.entity.AnalysisRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminAnalysisRecordRepository extends JpaRepository<AnalysisRecord, Long> {

    // ========================================
    // ✅ 1. 기본 목록 (중복 제거된 최신 분석만)
    // ========================================

    /**
     * 기본 테이블용 목록 조회:
     * 사용자 + 원문 해시(originalTextHash) 기준으로 최신 분석 1건만 반환
     */
    @Query("""
        SELECT ar FROM AnalysisRecord ar
        WHERE ar.id IN (
            SELECT MAX(ar2.id)
            FROM AnalysisRecord ar2
            GROUP BY ar2.createdBy.id, ar2.originalTextHash
        )
        ORDER BY ar.createdAt DESC
    """)
    Page<AnalysisRecord> findLatestPerUserAndSubject(Pageable pageable);

    // ========================================
    // ✅ 2. 검색 (중복 제거 적용)
    // ========================================

    /**
     * 사용자 이름 기준 검색 (중복 제거)
     */
    @Query("""
        SELECT ar FROM AnalysisRecord ar
        WHERE ar.id IN (
            SELECT MAX(ar2.id)
            FROM AnalysisRecord ar2
            WHERE ar2.createdBy.name LIKE %:keyword%
            GROUP BY ar2.createdBy.id, ar2.originalTextHash
        )
        ORDER BY ar.createdAt DESC
    """)
    Page<AnalysisRecord> findLatestByUserName(@Param("keyword") String keyword, Pageable pageable);

    /**
     * 주제(subject) 기준 검색 (중복 제거)
     */
    @Query("""
        SELECT ar FROM AnalysisRecord ar
        WHERE ar.id IN (
            SELECT MAX(ar2.id)
            FROM AnalysisRecord ar2
            WHERE ar2.subject LIKE %:keyword%
            GROUP BY ar2.createdBy.id, ar2.originalTextHash
        )
        ORDER BY ar.createdAt DESC
    """)
    Page<AnalysisRecord> findLatestBySubject(@Param("keyword") String keyword, Pageable pageable);

    // ========================================
    // ✅ 3. 통계용
    // ========================================

    /**
     * 오늘 분석 요청 수
     */
    int countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * 최근 7일 분석 기록 목록 (평균 매칭률 계산용)
     */
    List<AnalysisRecord> findByCreatedAtAfter(LocalDateTime from);

    /**
     * 최근 30일 일별 분석 건수 (그래프용 DTO 반환)
     */
    @Query("""
        SELECT new com.talk.back.admin.dto.AdminDailyCountDto(CAST(a.createdAt AS date), COUNT(a))
        FROM AnalysisRecord a
        WHERE a.createdAt >= :start
        GROUP BY CAST(a.createdAt AS date)
        ORDER BY CAST(a.createdAt AS date)
    """)
    List<AdminDailyCountDto> findDailyCountSince(@Param("start") LocalDateTime start);

    // ========================================
    // ✅ 4. 일치율 추이 보기
    // ========================================

    /**
     * 사용자 + 원문 해시 기준 전체 분석 추이 (versionNo 순 정렬)
     */
    List<AnalysisRecord> findByCreatedByIdAndOriginalTextHashOrderByVersionNoAsc(Long userId, String originalTextHash);
}
