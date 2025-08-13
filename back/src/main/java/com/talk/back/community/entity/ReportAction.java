// com.talk.back.community.entity.ReportAction
package com.talk.back.community.entity;

/**
 * 신고된 게시글의 처리 결과
 */
public enum ReportAction {
    NONE,       // 아직 처리되지 않음
    RESTORED,   // 복구됨
    DELETED     // 삭제됨(영구 숨김)
}
