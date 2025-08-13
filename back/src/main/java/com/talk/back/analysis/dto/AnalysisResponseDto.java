package com.talk.back.analysis.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AnalysisResponseDto {
    private Long recordId;
    private MatchDetailDto result;
    private String createdAt;
    private String originalText;
    private String userText;
    private String subject;
    private Boolean isImportant;


}