package com.talk.back.admin.dto;


/**
 * [DTO Projection 인터페이스]
 * - native query 결과를 받아올 때 사용됨
 * - 쿼리에서 지정한 alias(`AS date`, `AS users`)와 메서드명이 반드시 일치해야 함
 */
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUserStatDto {

    private long userCount;
    private long reportPendingCount; // ✅ 추가
    private long supportPendingCount; // ✅ 고객센터 답변 대기 수

    // 추후 필요 시 추가 가능:
    // private long analysisCount;
    // private double averageMatchRate;

}
