package com.talk.back.qna.controller;

import com.talk.back.admin.notice.dto.AdminNoticeResponseDto;
import com.talk.back.admin.notice.service.AdminNoticeService;
import com.talk.back.auth.entity.CustomUserDetails;
import com.talk.back.auth.entity.User;
import com.talk.back.qna.dto.SupportPostUpdateDto;
import com.talk.back.qna.service.SupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 🧑‍💼 사용자용 고객센터 컨트롤러
 * - 질문글 등록 및 조회만 가능
 * - 댓글(답변)은 관리자 전용 기능으로 분리됨
 */
@RestController
@RequestMapping("/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    // 공지 열람용 서비스 추가 주입
    private final AdminNoticeService adminNoticeService;

    // ✅ 사용자 질문글 전체 조회 (본인 글 + 관리자 글)
    @GetMapping("/posts")
    public ResponseEntity<List<com.talk.back.qna.dto.SupportPostResponseDto>> getPosts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails != null ? userDetails.getUser() : null;
        if (user == null) {
            // 비로그인 사용자는 공지만 조회
            return ResponseEntity.ok(supportService.getAllPosts(null));
        }
        // 로그인 사용자는 공지 + 본인 글만 조회
        return ResponseEntity.ok(supportService.getAllPosts(user));
    }


    // ✅ 질문글 상세 조회 (본인 글만 조회 가능)
    @GetMapping("/posts/{id}")
    public com.talk.back.qna.dto.SupportPostResponseDto getPostById(@PathVariable Long id,
                                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails != null ? userDetails.getUser() : null;
        return supportService.getPostById(id, user);
    }

    // ✅ 질문글 등록
    @PostMapping("/posts")
    public com.talk.back.qna.dto.SupportPostResponseDto createPost(@Valid @ModelAttribute com.talk.back.qna.dto.SupportPostCreateDto dto,
                                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        return supportService.createPost(dto, userDetails.getUser());
    }

    // ✅ 질문글 처리 상태 업데이트
    @PatchMapping("/posts/{id}/status")
    public void updateStatus(@PathVariable Long id,
                             @RequestBody com.talk.back.qna.dto.StatusUpdateDto statusDto) {
        supportService.updateStatus(id, statusDto.getStatus());
    }

    // 질문글 본인 수정
    @PutMapping("/posts/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id,
                                        @RequestBody SupportPostUpdateDto dto,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        supportService.updatePost(id, dto, userDetails.getUser());
        return ResponseEntity.ok().build();
    }

    // =========================
    // 🔔 공지사항: 사용자 공개(읽기)
    // =========================

    // 공지 목록
    @GetMapping("/notices")
    public ResponseEntity<List<AdminNoticeResponseDto>> listNotices() {
        return ResponseEntity.ok(adminNoticeService.list());
    }

    // 공지 상세
    @GetMapping("/notices/{id}")
    public ResponseEntity<AdminNoticeResponseDto> getNotice(@PathVariable Long id) {
        return ResponseEntity.ok(adminNoticeService.get(id));
    }

    // ❌ 댓글 등록 - 관리자만 가능하므로 비활성화
    /*
    @PostMapping("/posts/{postId}/comments")
    public com.talk.back.qna.dto.SupportCommentResponseDto addComment(
            @PathVariable Long postId,
            @RequestBody com.talk.back.qna.dto.SupportCommentCreateDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            System.out.println("댓글 작성 실패: 권한이 없습니다.");
            throw new RuntimeException("관리자 로그인이 필요합니다.");
        }

        dto.setPostId(postId);
        return supportService.addComment(dto, userDetails.getUser());
    }

    @GetMapping("/posts/{postId}/comments")
    public List<com.talk.back.qna.dto.SupportCommentResponseDto> getComments(@PathVariable Long postId) {
        return supportService.getComments(postId);
    }

    @PatchMapping("/posts/{postId}/comments/{commentId}")
    public com.talk.back.qna.dto.SupportCommentResponseDto updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody com.talk.back.qna.dto.SupportCommentUpdateDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        dto.setPostId(postId);
        dto.setCommentId(commentId);

        return supportService.updateComment(dto, userDetails.getUser());
    }
    */
}
