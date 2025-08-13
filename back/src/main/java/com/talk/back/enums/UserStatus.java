package com.talk.back.enums;

/**
 * 사용자 계정 상태를 나타내는 열거형
 * - 로그인 가능 여부나 UI 노출 여부 등을 결정함
 */
public enum UserStatus {
    ACTIVE,    // 정상
    DELETED,   // 탈퇴
    SUSPENDED, // 정지
    DORMANT    // 휴면
}