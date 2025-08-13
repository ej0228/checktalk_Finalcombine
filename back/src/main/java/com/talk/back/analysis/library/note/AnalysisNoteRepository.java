package com.talk.back.analysis.library.note;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalysisNoteRepository extends JpaRepository<AnalysisNote, Long> {
    List<AnalysisNote> findByAnalysisRecordIdOrderByCreatedAtDesc(Long recordId);

    int countByAnalysisRecordId(Long analysisId);
}