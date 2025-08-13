package com.talk.back.analysis.dto;


import com.talk.back.analysis.entity.AnalysisRecord;
import lombok.*;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AnalysisRecordDto {
    private Long id;
    private String date;
    private Double matchingRate;
    private String subject;
    private String userInput;
    private Boolean isImportant;
    private String hiddenAt;          // 숨긴 날짜
    private String scheduledDeletion; // 삭제 예정일
    private int noteCount;


    public static AnalysisRecordDto from(AnalysisRecord record, int noteCount) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일");
        DateTimeFormatter warningFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return AnalysisRecordDto.builder()
                .id(record.getId())
                .date(record.getCreatedAt().format(dateFormatter))
                .matchingRate(record.getMatchingRate())
                .subject(record.getSubject())
                .userInput(record.getUserText())
                .isImportant(record.isImportant())
                .hiddenAt(record.getHiddenAt() != null ? record.getHiddenAt().format(warningFormatter) : null)
                .scheduledDeletion(record.getHiddenAt() != null ? record.getHiddenAt().plusDays(30).format(warningFormatter) : null)
                .noteCount(noteCount)
                .build();

    }
}
