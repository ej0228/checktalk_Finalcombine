package com.talk.back.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 사용자 신고 이력을 저장하는 엔티티 클래스
 *
 * - 신고자가 특정 사용자를 신고한 기록을 남김
 * - 동일한 신고자가 같은 사용자를 중복 신고하지 못하도록 제약 가능
 * - 누적 신고 횟수를 기반으로 제재(정지 등)를 처리할 수 있음
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReport {

    /**
     * 신고 이력 ID (기본 키)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 신고 대상 사용자 (신고당한 사람)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_user_id", nullable = false)
    private User reportedUser;

    /**
     * 신고한 사용자 (신고자)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    /**
     * 신고 사유
     * - 욕설, 성희롱, 도배 등
     */
    @Column(length = 255)
    private String reason;

    /**
     * 신고가 접수된 시각
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime reportedAt;

    /**
     * 등록 시 자동 시간 설정
     */
    @PrePersist
    protected void onCreate() {
        this.reportedAt = LocalDateTime.now();
    }
}
