package com.talk.back.admin.dto;

import com.talk.back.admin.entity.AdminSupportAnswer;
import com.talk.back.qna.dto.SupportFileDto;
import com.talk.back.qna.entity.SupportPost;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSupportPostDto {

    private Long postId;
    private String title;
    private String content;
    private String writerEmail;
    private LocalDateTime createdAt;
    private String status;
    private String answerContent; // ✅ 답변 내용 포함
    private List<SupportFileDto> files; // 질문 이미지


    public static AdminSupportPostDto from(SupportPost post) {
        return from(post, Optional.empty()); // 답변 없이 변환
    }


    public static AdminSupportPostDto from(SupportPost post, Optional<AdminSupportAnswer> answerOpt) {
        return AdminSupportPostDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .writerEmail(post.getUser() != null ? post.getUser().getEmail() : "알 수 없음") // ✅
                // SupportPost에 getWriterEmail() 있다고 가정
                .createdAt(post.getCreatedAt())
                .status(post.getStatus().toString()) // enum이면 .name() 또는 .toString()
                .answerContent(answerOpt.map(AdminSupportAnswer::getContent).orElse(null))
// ✅ 여기에 files 추가 (사용자가 첨부한 이미지 보이기)
                .files(
                        post.getFiles().stream()
                                .map(file -> SupportFileDto.builder()
                                        .originalName(file.getOriginalName())
                                        .savedName(file.getSavedName())
                                        .filePath(file.getFilePath())
                                        .build())
                                .collect(Collectors.toList())
                )
                .build();
    }
}
