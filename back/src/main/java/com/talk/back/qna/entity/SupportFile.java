package com.talk.back.qna.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SupportFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalName; // 원본 파일명
    private String savedName;    // 저장된 파일명 (UUID 포함)
    private String filePath;     // 저장 경로 또는 URL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private SupportPost post;
}
