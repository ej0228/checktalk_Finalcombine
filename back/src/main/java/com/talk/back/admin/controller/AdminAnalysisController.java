package com.talk.back.admin.controller;

import com.talk.back.admin.dto.AdminAnalysisDailyStatsDto;
import com.talk.back.admin.dto.AdminDailyCountDto;
import com.talk.back.admin.dto.AdminMatchingTrendDto;
import com.talk.back.admin.dto.AdminAnalysisRecordListDto;
import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.admin.service.AdminAnalysisService;
import com.talk.back.admin.service.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/analysis")
@RequiredArgsConstructor
public class AdminAnalysisController {

    private final AdminAnalysisService adminAnalysisService;
    private final AdminLogService adminLogService;

    /**
     * ✅ 관리자 - 분석 기록 목록 (페이지네이션 + 검색 포함)
     */
    @GetMapping("/list")
    public Page<AdminAnalysisRecordListDto> getPagedAnalysisRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type
    ) {
        String adminId = SecurityContextHolder.getContext().getAuthentication().getName();

        if (keyword != null && type != null) {
            if ("subject".equals(type)) {
                adminLogService.saveLog(AdminLogType.SEARCH_ANALYSIS_SUBJECT, adminId,
                        "subject contains \"" + keyword + "\"");
            } else if ("user".equals(type)) {
                adminLogService.saveLog(AdminLogType.SEARCH_ANALYSIS_USER, adminId,
                        "user contains \"" + keyword + "\"");
            }
        }

        return adminAnalysisService.getPagedAnalysisRecords(page, size, keyword, type);
    }

    /**
     * ✅ 관리자 - 동일 원본 텍스트에 대한 재분석 추이
     */
    @GetMapping("/history")
    public ResponseEntity<?> getMatchingTrend(
            @RequestParam Long userId,
            @RequestParam String originalTextHash
    ) {
        try {
            String adminId = SecurityContextHolder.getContext().getAuthentication().getName();

            adminLogService.saveLog(
                    AdminLogType.VIEW_ANALYSIS_DETAIL,
                    adminId,
                    "userId=" + userId + ", originalTextHash=" + originalTextHash
            );

            List<AdminMatchingTrendDto> result =
                    adminAnalysisService.getMatchingTrend(userId, originalTextHash);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류: " + e.getMessage());
        }
    }

    /**
     * ✅ 관리자 - 일일 분석 요청 수 + 평균 매칭률 통계
     */
    @GetMapping("/stats/daily")
    public ResponseEntity<AdminAnalysisDailyStatsDto> getDailyStats() {
        return ResponseEntity.ok(adminAnalysisService.getDailyStats());
    }

    /**
     * ✅ 관리자 - 월간 분석 요청 추이 (최근 30일)
     */
    @GetMapping("/stats/monthly")
    public ResponseEntity<List<AdminDailyCountDto>> getMonthlyStats() {
        return ResponseEntity.ok(adminAnalysisService.getMonthlyStats());
    }
}
