package com.talk.back.admin.dto;

import com.talk.back.analysis.entity.AnalysisRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalysisRecordListDto {
    private Long id;
    private Long userId;
    private String userName;
    private String subject; //UI에서 미노출
    private double matchingRate;
    private String originalTextHash;
    private LocalDateTime createdAt;

    public static AdminAnalysisRecordListDto from(AnalysisRecord record) {
        return AdminAnalysisRecordListDto.builder()
                .id(record.getId())
                .userId(record.getCreatedBy().getUserId())
                .userName(record.getCreatedBy().getName())
                .subject(record.getSubject()) //// 유지
                .matchingRate(record.getMatchingRate())
                .originalTextHash(record.getOriginalTextHash())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
