package com.talk.back.admin.notice.entity;

import com.talk.back.admin.entity.AdminUser;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Entity
@Table(name = "admin_notice")
public class AdminNotice {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=255)
    private String title;

    @Lob
    @Column(nullable=false)
    private String content;

    // ✅ 기본값은 엔티티 레벨에서만 지정 (프론트 값 오면 그 값을 사용)
    @Builder.Default
    @Column(nullable=false)
    private boolean pinned = false;   // 서버 기본은 false (프론트에서 true로 보내면 그 값 유지)

    @Builder.Default
    @Column(nullable=false)
    private boolean visible = true;   // 기본 true

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private AdminUser writer;

    @Column(nullable=false)
    private LocalDateTime createdAt;

    @Column(nullable=false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        // ❌ pinned/visible 덮어쓰지 않음
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}