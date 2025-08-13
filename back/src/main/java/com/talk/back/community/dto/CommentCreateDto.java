package com.talk.back.community.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentCreateDto {
    private String content;
    private String email;
    private String authorName;
}