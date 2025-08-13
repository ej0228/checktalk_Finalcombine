package com.talk.back.admin.controller;

import com.talk.back.admin.dto.AdminSupportAnswerDto;
import com.talk.back.admin.dto.AdminSupportPostDto;
import com.talk.back.admin.service.AdminSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 👮 관리자 고객센터 API
 * - 질문글 전체 조회
 * - 답변 등록
 * - 답변 수정
 */
@RestController
@RequestMapping("/admin/qna")
@RequiredArgsConstructor
public class AdminSupportController {

    private final AdminSupportService adminSupportService;

    // 질문글 전체 조회
    @GetMapping
    public ResponseEntity<Page<AdminSupportPostDto>> getPagedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status //상태 필터: 처리완료 or 미답변 or null
    ) {
        return ResponseEntity.ok(adminSupportService.getPagedPosts(page, size, status));
    }


    // 👇 프론트에서 /admin/qna/posts/{id} 호출 시 대응
    @GetMapping("/posts/{id}")
    public ResponseEntity<AdminSupportPostDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(adminSupportService.getPostById(id));
    }

    // 답변 등록
    @PostMapping("/{postId}/answer")
    public ResponseEntity<Void> writeAnswer(@PathVariable Long postId, @RequestBody AdminSupportAnswerDto dto) {
        adminSupportService.writeAnswer(postId, dto);
        return ResponseEntity.ok().build();
    }

    // 답변 수정
    @PutMapping("/{postId}/answer")
    public ResponseEntity<Void> updateAnswer(@PathVariable Long postId, @RequestBody AdminSupportAnswerDto dto) {
        adminSupportService.updateAnswer(postId, dto);
        return ResponseEntity.ok().build();
    }
}
