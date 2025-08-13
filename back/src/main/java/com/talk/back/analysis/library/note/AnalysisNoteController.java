package com.talk.back.analysis.library.note;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notes")
public class AnalysisNoteController {

    private final AnalysisNoteService analysisNoteService;

    // 노트 등록
    @PostMapping("/{recordId}")
    public ResponseEntity<?> saveNote(
            @PathVariable Long recordId,
            @RequestBody String content
    ) {
        AnalysisNote saved = analysisNoteService.saveNote(recordId, content);
        return ResponseEntity.ok(saved);
    }

    // 노트 조회
    @GetMapping("/{recordId}")
    public ResponseEntity<List<AnalysisNote>> getNotes(@PathVariable Long recordId) {
        List<AnalysisNote> notes = analysisNoteService.getNotesByRecordId(recordId);
        return ResponseEntity.ok(notes);
    }

    // 노트 삭제
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long noteId) {
        analysisNoteService.deleteNote(noteId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

}