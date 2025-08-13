package com.talk.back.admin.controller;

import com.talk.back.admin.dto.AdminUserLogDto;
import com.talk.back.admin.service.AdminUserLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/user-log")
public class AdminUserLogController {

    private final AdminUserLogService adminUserLogService;

    /**
     * 사용자 로그인 로그 목록 조회 (이름 검색 + 날짜 범위 필터 포함)
     *
     * @param name      사용자 이름 (선택)
     * @param startDate 시작 날짜 (yyyy-MM-dd 형식, 선택)
     * @param endDate   종료 날짜 (yyyy-MM-dd 형식, 선택)
     * @param pageable  페이지네이션 정보
     * @return 필터링된 로그인 로그 목록
     */
    @GetMapping("/list")
    public Page<AdminUserLogDto> getFilteredLogs(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 20, sort = "actionTime", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return adminUserLogService.getFilteredLogs(name, startDate, endDate, pageable);
    }
}
