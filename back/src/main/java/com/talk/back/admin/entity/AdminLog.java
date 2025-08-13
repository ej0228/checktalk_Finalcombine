package com.talk.back.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AdminLogType type;       // enum으로 변경

    private String user;             // 관리자 ID (예: admin01)

    private String details;          // 상세 정보 (예: recordId=42, subject="진화론")

    private LocalDateTime timestamp; // 작업 일시
}

