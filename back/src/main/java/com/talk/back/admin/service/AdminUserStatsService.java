package com.talk.back.admin.service;

import com.talk.back.admin.dto.AdminDailyUserStatDto;
import com.talk.back.admin.dto.AdminUserStatDto;
import com.talk.back.admin.repository.AdminUserStatsRepository;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.community.repository.CommentReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * [Service - 관리자 통계 로직 처리]
 * - 총 회원 수 조회: UserRepository.count()
 * - 가입자 추이 조회: native query → DTO로 매핑된 결과 반환
 */
@Service
@RequiredArgsConstructor
public class AdminUserStatsService {

    private final UserRepository userRepository;                     // 총 회원 수 조회용
    private final AdminUserStatsRepository adminUserStatsRepository; // 가입자 추이 조회용
    private final CommentReportRepository commentReportRepository;
    private final AdminSupportService adminSupportService; // ✅ 추가

    // 전체 회원 수 조회
    public long getTotalUsers() {
        return userRepository.count();
    }

    // 가입자 추이 DTO 조회
    public List<AdminDailyUserStatDto> getDailyUserStats() {
        return adminUserStatsRepository.countUsersGroupedByDate();
    }


    // ✅ 처리 대기 중인 신고글 수
    public long getPendingReportCount() {
        return commentReportRepository.countPendingReports();
    }

    // ✅ 추가: 고객센터 답변 대기 수
    public long getPendingSupportCount() {
        return adminSupportService.countPendingSupportPosts();
    }

    // ✅ 통합 통계 응답 DTO
    public AdminUserStatDto getDashboardStats() {
        return AdminUserStatDto.builder()
                .userCount(getTotalUsers())
                .reportPendingCount(getPendingReportCount())
                .supportPendingCount(getPendingSupportCount()) // ✅ 포함
                .build();
    }

}
