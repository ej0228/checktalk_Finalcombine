package com.talk.back.qna.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class CommentCreateDto {
    private String content;
    private String authorName;
    private String authorEmail;
    private Long userId;
}
