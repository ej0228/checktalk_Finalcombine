package com.talk.back.analysis.library.note;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import com.talk.back.analysis.entity.AnalysisRecord;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_note")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id")
    @JsonBackReference
    private AnalysisRecord analysisRecord;

    @Lob
    @Column(nullable = false)
    private String content; // 노트 내용

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
