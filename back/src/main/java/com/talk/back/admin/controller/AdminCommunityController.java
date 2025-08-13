package com.talk.back.admin.controller;

import com.talk.back.admin.dto.AdminCommentDto;
import com.talk.back.admin.service.AdminCommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 📂 관리자 전용 커뮤니티 게시글 관리 컨트롤러
 * - 신고 누적으로 숨김 처리된 게시글 조회
 * - 관리자 복구 / 삭제 처리 API 제공
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminCommunityController {

    private final AdminCommunityService adminCommunityService;

    /**
     * 🚩 신고된 게시글 목록 조회
     * - 신고 수 ≥ 3 && 숨김 처리된 게시글만 조회
     * - 사용자가 삭제한 글도 포함됨 (관리자 판단 필요)
     * - 신고글 조회 API에 처리 상태 필터링 기능 추가
     */
    @GetMapping("/reported-comments")
    public ResponseEntity<?> getReportedComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        Page<AdminCommentDto> result;

        if (status == null || status.isBlank()) {
            result = adminCommunityService.getReportedComments(page, size);
        } else {
            result = adminCommunityService.getReportedCommentsFiltered(page, size, status);
        }

        return ResponseEntity.ok(result);
    }


    /**
     * ✅ 게시글 복구 (관리자 전용)
     * - 신고 수 초기화 (reportCount = 0)
     * - 숨김 해제 (hiddenByReport = false)
     * - deleted(사용자 삭제)는 변경하지 않음
     */
    @PutMapping("/comments/{id}/restore")
    public ResponseEntity<?> restoreComment(@PathVariable Long id) {
        adminCommunityService.restoreComment(id);
        return ResponseEntity.ok("게시글 복구 완료");
    }

    /**
     * 🗑 게시글 삭제 (관리자 전용, Soft Delete 방식)
     * - DB에서 완전 삭제하지 않고 deleted = true 설정
     * - 처리 상태/결과 기록됨
     */
    @PutMapping("/comments/{id}/soft-delete")
    public ResponseEntity<?> softDeleteComment(@PathVariable Long id) {
        adminCommunityService.softDeleteComment(id);
        return ResponseEntity.ok("게시글 삭제 처리 완료 (소프트 딜리트)");
    }
}
