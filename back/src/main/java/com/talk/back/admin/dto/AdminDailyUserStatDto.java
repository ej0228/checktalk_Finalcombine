package com.talk.back.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * [DTO - 일일 가입자 수 추이용]
 * - native query로 반환된 (날짜, 가입자 수) 결과를 담는 전용 DTO
 */
@Getter
@AllArgsConstructor
public class AdminDailyUserStatDto {
    private String date;   // 예: "07/31"
    private Long users;    // 해당 날짜의 가입자 수
}
