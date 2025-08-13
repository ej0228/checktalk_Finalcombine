package com.talk.back.admin.dto;

import com.talk.back.analysis.entity.AnalysisRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AdminMatchingTrendDto {
    private int versionNo;
    private double matchingRate;
    private LocalDateTime createdAt;

    public static AdminMatchingTrendDto from(AnalysisRecord record) {
        return AdminMatchingTrendDto.builder()
                .versionNo(record.getVersionNo())
                .matchingRate(record.getMatchingRate())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
