package com.talk.back.community.controller;

import com.talk.back.auth.entity.CustomUserDetails;
import com.talk.back.community.dto.CommentCreateDto;
import com.talk.back.community.dto.CommentReportDto;
import com.talk.back.community.dto.CommentResponseDto;
import com.talk.back.community.dto.CommentUpdateDto;
import com.talk.back.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CommentCreateDto dto
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
                commentService.createComment(userDetails.getUser(), dto)
        );
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getComments(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
                commentService.getCommentsWithPageInfo(page, userDetails.getUser())
        );
    }


    @PatchMapping("/comments/{commentId}/like")
    public ResponseEntity<CommentResponseDto> toggleLike(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CommentResponseDto updated = commentService.toggleLike(userDetails.getUser(), commentId);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/comments/{commentId}/report")
    public ResponseEntity<CommentResponseDto> reportComment(
            @PathVariable Long commentId,
            @RequestBody CommentReportDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CommentResponseDto updated = commentService.toggleReport(userDetails.getUser(), commentId, dto.getReason());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/comments/{id}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody CommentUpdateDto dto
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CommentResponseDto updated = commentService.updateComment(userDetails.getUser(), id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        commentService.deleteComment(userDetails.getUser(), id);
        return ResponseEntity.noContent().build();
    }
}
