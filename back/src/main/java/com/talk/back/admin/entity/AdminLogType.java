package com.talk.back.admin.entity;

public enum AdminLogType {
    LOGIN,                        // 로그인
    LOGOUT,                       // 로그아웃
    DEACTIVATE_USER,              // 회원 비활성화
    VIEW_ANALYSIS_DETAIL,         // 분석기록 상세보기
    SEARCH_ANALYSIS_SUBJECT,      // 분석기록 주제 검색
    SEARCH_ANALYSIS_USER,         // 분석기록 사용자 검색
    RESTORED_POST,                // 게시글 복구
    DELETED_POST,                  // 게시글 삭제
    SUPPORT_REPLY_CREATED,   // 답변 등록
    SUPPORT_REPLY_UPDATED    // 답변 수정
}
