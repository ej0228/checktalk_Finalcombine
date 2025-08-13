package com.talk.back.analysis.entity;

import jakarta.persistence.*;
import com.talk.back.auth.entity.User;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Entity
    @ToString
    @Table(name = "analysis_record")
    public class AnalysisRecord {

        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // 작성자 정보 추가
        @ManyToOne
        @JoinColumn(name = "created_by") // created_by 컬럼에 FK 저장
        private User createdBy;


        /** 원본 텍스트: 사용자가 입력한 텍스트 + (있다면) txt 파일 내용 */
        @Lob
        @Column(name = "original_text", columnDefinition = "LONGTEXT")
        private String originalText;

        /** 사용자가 이해한 텍스트 */
        @Lob
        @Column(name = "userText", columnDefinition = "LONGTEXT")
        private String userText;

        /** 매칭률 등 결과 JSON 문자열 (프론트에서 쓰는 구조 그대로) */
        @Lob
        @Column(name = "result_json", columnDefinition = "LONGTEXT")
        private String resultJson;

        /** 업로드 원본 파일 메타정보 */
        private String originalFileName;
        private String originalFileContentType;
        private Long   originalFileSize;

        /** 원본 파일 RAW 데이터 (옵션) */
        @Lob
        private byte[] originalFileBytes;

        @CreationTimestamp
        private LocalDateTime createdAt;

        @UpdateTimestamp
        private LocalDateTime updatedAt;

        /** 같은 원본 데이터로 다시 재분석을 할때  */
        @Column(nullable = false)
        private String originalTextHash; // originalText 해시 or 요약 ID 등
        //originalText를 Hashing(MD5 등)해서 저장. 같은 내용이면 같은 값.
        @Column(nullable = false)
        private Integer versionNo; // 동일 originalText에 대해 몇 번째 분석인지
        //동일한 originalTextHash끼리 그룹핑해서 몇 번째 재분석인지 나타냄.

        @Column(nullable = false)
        private Double matchingRate; //매칭율

        @Column(nullable = false)
        private boolean isImportant; // ⭐ 중요도 (별표 표시)

        @Column(length = 100)
        private String subject; // 원본 테스트 요약 제목

        @Builder.Default
        @Column(name = "is_hidden", nullable = false)
        private Boolean isHidden = false;

        @Column(name = "hidden_at")
        private LocalDateTime hiddenAt;


    }

