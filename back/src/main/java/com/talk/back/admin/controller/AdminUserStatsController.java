package com.talk.back.admin.controller;

import com.talk.back.admin.dto.AdminDailyUserStatDto;
import com.talk.back.admin.dto.AdminUserStatDto;
import com.talk.back.admin.service.AdminUserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * [Controller - 관리자용 가입자 통계 API]
 *
 * - GET /admin/stats/users/total : 전체 회원 수
 * - GET /admin/stats/users/daily : 날짜별 가입자 수
 * - CORS 설정은 SecurityConfig에서 전역 적용
 */
@RestController
@RequestMapping("/admin/stats/users")
@RequiredArgsConstructor
public class AdminUserStatsController {

    private final AdminUserStatsService adminUserStatsService;


    // 전체 회원 수 조회
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(adminUserStatsService.getTotalUsers());
    }

    // 날짜별 가입자 추이 조회
    @GetMapping("/daily")
    public ResponseEntity<List<AdminDailyUserStatDto>> getDailyStats() {
        return ResponseEntity.ok(adminUserStatsService.getDailyUserStats());
    }


    // ✅ 추가: 고객센터 답변 대기 수
    @GetMapping("/support/pending-count")
    public ResponseEntity<Long> getPendingSupportCount() {
        return ResponseEntity.ok(adminUserStatsService.getPendingSupportCount());
    }



    // ✅ 통합 통계 API
    @GetMapping
    public ResponseEntity<AdminUserStatDto> getStats() {
        AdminUserStatDto stats = adminUserStatsService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
