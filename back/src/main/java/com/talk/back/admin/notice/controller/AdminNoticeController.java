package com.talk.back.admin.notice.controller;

import com.talk.back.admin.notice.dto.AdminNoticeCreateDto;
import com.talk.back.admin.notice.dto.AdminNoticeResponseDto;
import com.talk.back.admin.notice.dto.AdminNoticeUpdateDto;
import com.talk.back.admin.notice.service.AdminNoticeService;
import com.talk.back.admin.repository.AdminUserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/notice")
public class AdminNoticeController {

    private final AdminNoticeService noticeService;
    private final AdminUserRepository adminUserRepository;

    /**
     * 공지사항 등록
     */
    @PostMapping
    public ResponseEntity<AdminNoticeResponseDto> create(
            @AuthenticationPrincipal String username, // ✅ 수정: expression 제거
            @Valid @RequestBody AdminNoticeCreateDto dto) {

        if (username == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 인증 필요");
        }

        Long adminId = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 없음"))
                .getId();

        return ResponseEntity.ok(noticeService.create(dto, adminId));
    }

    /**
     * 공지사항 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdminNoticeResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminNoticeUpdateDto dto) {
        return ResponseEntity.ok(noticeService.update(id, dto));
    }

    /**
     * 공지사항 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 공지사항 단건 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminNoticeResponseDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.get(id));
    }

    /**
     * 공지사항 페이지네이션 조회 (visible=true, 핀 우선 + 최신순)
     * 예) GET /admin/notice?page=0&size=5
     */
    @GetMapping
    public ResponseEntity<Page<AdminNoticeResponseDto>> list(
            @PageableDefault(size = 10, sort = {"pinned", "createdAt"}, direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return ResponseEntity.ok(noticeService.list(pageable));
    }

    /**
     * 공지사항 고정 여부 변경
     */
    @PatchMapping("/{id}/pin")
    public ResponseEntity<AdminNoticeResponseDto> pin(
            @PathVariable Long id,
            @RequestParam boolean pinned) {
        return ResponseEntity.ok(noticeService.togglePin(id, pinned));
    }
}
