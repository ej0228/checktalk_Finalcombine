package com.talk.back.admin.controller;

import com.talk.back.admin.entity.AdminLogType;
import com.talk.back.admin.service.AdminLogService;
import com.talk.back.admin.service.AdminUserService;
import com.talk.back.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * 관리자 모드 - 회원 관리 기능용 컨트롤러
 */
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final AdminLogService adminLogService;

    /**
     * 삭제되지 않은 모든 사용자 목록 반환 (페이지네이션 적용)
     */
    @GetMapping
    public ResponseEntity<Page<User>> getAllActiveUsersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("userId").descending());
        return ResponseEntity.ok(adminUserService.getActiveUsersPaged(pageable));
    }

    /**
     * 사용자 삭제 (소프트 딜리트)
     */
    @PatchMapping("/{userId}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminUserService.softDeleteUser(userId);

        String currentAdminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        adminLogService.saveLog(AdminLogType.DEACTIVATE_USER, currentAdminUsername);

        return ResponseEntity.ok("삭제 완료");
    }

    /**
     * 사용자 복구 처리
     */
    @PatchMapping("/{userId}/restore")
    public ResponseEntity<String> restoreUser(@PathVariable Long userId) {
        adminUserService.restoreUser(userId);
        return ResponseEntity.ok("복구 완료");
    }

    /**
     * 회원 검색 (이름 또는 이메일)
     */
    @GetMapping("/search")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam("type") String type,
            @RequestParam("keyword") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("userId").descending());
        Page<User> result = adminUserService.searchUsers(type, keyword, pageable);
        return ResponseEntity.ok(result);
    }
}
