package com.talk.back.analysis.library.note;


import com.talk.back.analysis.entity.AnalysisRecord;
import com.talk.back.analysis.repository.AnalysisRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisNoteService {

    private final AnalysisNoteRepository analysisNoteRepository;
    private final AnalysisRecordRepository analysisRecordRepository;

    // 노트 저장
    @Transactional
    public AnalysisNote saveNote(Long recordId, String content) {
        AnalysisRecord record = analysisRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("분석 기록을 찾을 수 없습니다: " + recordId));

        AnalysisNote note = AnalysisNote.builder()
                .analysisRecord(record)
                .content(content)
                .build();

        return analysisNoteRepository.save(note);
    }

    // 노트 조회
    @Transactional(readOnly = true)
    public List<AnalysisNote> getNotesByRecordId(Long recordId) {
        System.out.println("==> [AnalysisNoteService::getNotesByRecordId] ---> 조회 성공"  );
        try {
            return analysisNoteRepository.findByAnalysisRecordIdOrderByCreatedAtDesc(recordId);
        } catch (Exception e) {
            log.error("노트 조회 실패", e);
            throw e;
        }


    }

    //노트 삭제
    @Transactional
    public void deleteNote(Long noteId) {
        if (!analysisNoteRepository.existsById(noteId)) {
            throw new IllegalArgumentException("노트가 존재하지 않습니다: " + noteId);
        }
        analysisNoteRepository.deleteById(noteId);
    }


}