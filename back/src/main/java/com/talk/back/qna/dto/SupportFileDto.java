package com.talk.back.qna.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class SupportFileDto {
    private String originalName;
    private String savedName;
    private String filePath; // "/uploads/support/uuid_filename.png"
}
