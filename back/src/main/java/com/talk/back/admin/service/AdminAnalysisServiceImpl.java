package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminAnalysisDailyStatsDto;
import com.talk.back.admin.dto.AdminDailyCountDto;
import com.talk.back.admin.dto.AdminMatchingTrendDto;
import com.talk.back.admin.dto.AdminAnalysisRecordListDto;
import com.talk.back.admin.repository.AdminAnalysisRecordRepository;
import com.talk.back.analysis.entity.AnalysisRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAnalysisServiceImpl implements AdminAnalysisService {

    private final AdminAnalysisRecordRepository adminAnalysisRecordRepository;

    /**
     * ✅ 관리자 - 전체 목록 비페이지 조회 (기존 방식 유지)
     */
    @Override
    public List<AdminAnalysisRecordListDto> getAllAnalysisRecords() {
        return adminAnalysisRecordRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(AdminAnalysisRecordListDto::from)
                .toList();
    }

    /**
     * ✅ 관리자 - 사용자별 분석 추이 조회
     */
    @Override
    public List<AdminMatchingTrendDto> getMatchingTrend(Long userId, String originalTextHash) {
        return adminAnalysisRecordRepository
                .findByCreatedByIdAndOriginalTextHashOrderByVersionNoAsc(userId, originalTextHash)
                .stream()
                .map(AdminMatchingTrendDto::from)
                .toList();
    }

    /**
     * ✅ 관리자 - 검색 + 페이지네이션 목록 조회 (중복 제거 + 최신 분석만)
     */
    @Override
    public Page<AdminAnalysisRecordListDto> getPagedAnalysisRecords(int page, int size, String keyword, String type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AnalysisRecord> records;

        if ("user".equals(type) && keyword != null && !keyword.isBlank()) {
            records = adminAnalysisRecordRepository.findLatestByUserName(keyword, pageable);
        } else if ("subject".equals(type) && keyword != null && !keyword.isBlank()) {
            records = adminAnalysisRecordRepository.findLatestBySubject(keyword, pageable);
        } else {
            records = adminAnalysisRecordRepository.findLatestPerUserAndSubject(pageable);
        }

        return records.map(AdminAnalysisRecordListDto::from);
    }

    /**
     * ✅ 관리자 - 오늘 분석 요청 수 + 최근 7일 평균 매칭률
     */
    @Override
    public AdminAnalysisDailyStatsDto getDailyStats() {
        // 오늘 00:00 ~ 내일 00:00 범위
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        int todayCount = adminAnalysisRecordRepository.countByCreatedAtBetween(startOfDay, endOfDay);

        // 최근 7일 매칭률 평균 계산
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<AnalysisRecord> recentRecords = adminAnalysisRecordRepository.findByCreatedAtAfter(sevenDaysAgo);

        double averageMatchingRate = recentRecords.stream()
                .mapToDouble(AnalysisRecord::getMatchingRate)
                .average()
                .orElse(0.0);

        return new AdminAnalysisDailyStatsDto(todayCount, averageMatchingRate);
    }

    /**
     * ✅ 관리자 - 최근 30일 분석 건수 (날짜별 집계)
     */
    @Override
    public List<AdminDailyCountDto> getMonthlyStats() {
        LocalDateTime from = LocalDateTime.now().minusDays(30);
        return adminAnalysisRecordRepository.findDailyCountSince(from);
    }
}
