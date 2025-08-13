package com.talk.back.auth.entity;

import jakarta.persistence.*;
import com.talk.back.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 사용자 상태 변경 이력을 기록하는 엔티티 클래스
 *
 * [용도]
 * - 관리자가 사용자 상태를 변경한 기록을 추적
 * - 시스템에 의한 자동 상태 변경 이력 (예: 정지, 휴면 등)
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusLog {

    // 고유 식별자 (Primary Key, 자동 증가)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 상태가 변경된 사용자 ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 변경 전 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus fromStatus;

    // 변경 후 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus toStatus;

    // 변경 시각
    @Column(nullable = false)
    private LocalDateTime changedAt;

    // 변경 주체 (예: SYSTEM, ADMIN 등)
    @Column(length = 50)
    private String changedBy;
}
