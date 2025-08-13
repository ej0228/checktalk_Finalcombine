package com.talk.back.analysis.dto;

import lombok.*;

@Getter
@Setter
//@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ResetResponseDto {
    private Long newRecordId;
    private Integer versionNo;

    private String originalText;
    private String originalTextHash;

    private String message;




}
