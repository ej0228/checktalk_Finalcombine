package com.talk.back.admin.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class AdminDailyCountDto {
    private final LocalDate date;
    private final long count;

    public AdminDailyCountDto(java.sql.Date date, long count) {
        this.date = date.toLocalDate(); // 변환 필수
        this.count = count;
    }
}