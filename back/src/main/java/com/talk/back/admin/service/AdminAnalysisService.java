package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminAnalysisDailyStatsDto;
import com.talk.back.admin.dto.AdminDailyCountDto;
import com.talk.back.admin.dto.AdminMatchingTrendDto;
import com.talk.back.admin.dto.AdminAnalysisRecordListDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdminAnalysisService {

    // =====================================
    // ✅ 1. 분석 기록 목록 관련
    // =====================================

    /**
     * ✅ 관리자 - 페이징 + 검색 목록 조회
     * 중복 제거 후, 사용자+원문 기준 최신 분석 1건만 보여줌
     *
     * @param page    페이지 번호 (0부터 시작)
     * @param size    페이지 크기
     * @param keyword 검색어 (nullable)
     * @param type    검색 타입 ("user" or "subject")
     */
    Page<AdminAnalysisRecordListDto> getPagedAnalysisRecords(int page, int size, String keyword, String type);

    /**
     * ✅ 관리자 - 전체 목록 비페이지 조회 (중복 포함, 기존 방식 유지 시 사용)
     */
    List<AdminAnalysisRecordListDto> getAllAnalysisRecords();

    // =====================================
    // ✅ 2. 추이 분석 (자세히 보기)
    // =====================================

    /**
     * ✅ 관리자 - 특정 사용자+원문 해시 기준으로 분석 추이 조회
     */
    List<AdminMatchingTrendDto> getMatchingTrend(Long userId, String originalTextHash);

    // =====================================
    // ✅ 3. 통계 관련
    // =====================================

    /**
     * ✅ 관리자 - 일일 분석 통계 (오늘 분석 수 + 최근 7일 평균 매칭률)
     */
    AdminAnalysisDailyStatsDto getDailyStats();

    /**
     * ✅ 관리자 - 최근 30일 분석 건수 (일별 집계 그래프용)
     */
    List<AdminDailyCountDto> getMonthlyStats();
}
