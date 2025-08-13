package com.talk.back.analysis.repository;

import com.talk.back.analysis.entity.AnalysisRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisRecordRepository extends JpaRepository<AnalysisRecord, Long> {


    @Query("SELECT MAX(a.versionNo) FROM AnalysisRecord a WHERE a.originalTextHash = :textHash")
    Optional<Integer> findMaxVersionByOriginalTextHash(@Param("textHash") String textHash);

    Optional<AnalysisRecord> findByOriginalTextHashAndVersionNo(String textHash, int i);

    List<AnalysisRecord> findByCreatedByUserId(Long userId);
    // Page<AnalysisRecord> findByCreatedByUserId(Long userId, Pageable pageable); // 기본분석목록 Hidden조건 추가로 변경

    //기본 분석 목록
    //Page<AnalysisRecord> findByCreatedByUserIdAndIsHiddenFalse(Long userId, Pageable pageable);
    @Query("SELECT a FROM AnalysisRecord a WHERE a.createdBy.userId = :userId AND (a.isHidden IS NULL OR a.isHidden = false)")
    Page<AnalysisRecord> findVisibleRecordsByUserId(@Param("userId") Long userId, Pageable pageable);

    //숨겨진 목록 조회
    Page<AnalysisRecord> findByCreatedByUserIdAndIsHiddenTrue(Long userId, Pageable pageable);

    Page<AnalysisRecord> findByOriginalTextHashAndIdNot(String hash, Long excludeId, Pageable pageable);

    //숨겨진 목록 전체 갯수 조회
    long countByCreatedByUserIdAndIsHiddenTrue(Long userId);
}
