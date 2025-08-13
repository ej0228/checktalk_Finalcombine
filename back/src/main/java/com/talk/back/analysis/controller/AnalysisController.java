package com.talk.back.analysis.controller;

import com.talk.back.analysis.dto.AnalysisRecordDto;
import com.talk.back.analysis.dto.AnalysisRequestDto;
import com.talk.back.analysis.dto.AnalysisResponseDto;
import com.talk.back.analysis.dto.ResetResponseDto;
import com.talk.back.analysis.entity.AnalysisRecord;
import com.talk.back.analysis.fastapi.FastApiResponseDto;
import com.talk.back.analysis.fastapi.FastApiService;
import com.talk.back.analysis.library.note.AnalysisNoteRepository;
import com.talk.back.analysis.repository.AnalysisRecordRepository;
import com.talk.back.analysis.service.AnalysisService;
import com.talk.back.auth.entity.CustomUserDetails;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/analysis")
@RequiredArgsConstructor
@ToString
public class AnalysisController {

    private final AnalysisService analysisService;
    private final AnalysisRecordRepository analysisRecordRepository;
    private final AnalysisNoteRepository analysisNoteRepository;
    private final FastApiService fastApiService; //FastApi 기능 사용을 위한 객체선언

    /**
     * 분석 요청 (텍스트 + txt 파일)
     */
    @PostMapping(value = "/start", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AnalysisResponseDto analyze(
            @RequestParam(required = false) String originalText,
            @RequestParam @NotBlank String userText,
            @RequestParam(required = false) MultipartFile originalFile
    ) throws Exception {
        System.out.println("==> [AnalysisController::AnalysisResponseDto 시작 .../api/start] ");
        System.out.println("==> [AnalysisController::analyze - KoSBERT 호출 시작]");

        // 🔹 FastAPI 분석 서버 호출
        FastApiResponseDto fastApiResult = fastApiService.requestAnalysis(originalText, userText);
        double matchingRate = fastApiResult.getMatchingRate();

        AnalysisRequestDto analysisRequestDto = AnalysisRequestDto.builder()
                .originalText(originalText)
                .userText(userText)
                .originalFile(originalFile)
                .matchingRate(matchingRate) //FastAPI 결과를 포함
                .build();

        System.out.println("AnalysisRequestDto= " + analysisRequestDto);
        System.out.println("==> [AnalysisController::AnalysisResponseDto .../api/start 끝]");

        return analysisService.analyzeAndSave(analysisRequestDto);

    }

    /**
     * 저장된 결과 조회
     */
    @GetMapping("/{id}")
    public AnalysisResponseDto getOne(@PathVariable Long id) throws Exception {
        System.out.println("==> [AnalysisController::getOne 시작] ");
        AnalysisResponseDto analysisResponseDto = analysisService.getResult(id);

        System.out.println("==> [AnalysisController::getOne 끝] 념겨준 값 analysisResponseDto =" + analysisResponseDto);
        return analysisResponseDto;
    }

    //@PostMapping("/{recordId}/reset-understanding")  --> Post로 하면 insert 가 됨
    @PutMapping("/{recordId}/reset-understanding")
    public ResponseEntity<?> resetUnderstanding(@PathVariable Long recordId) {
        System.out.println("==> [AnalysisController::resetUnderstanding 시작] ");

        try {
            ResetResponseDto resetResponseDto = analysisService.resetUnderstanding(recordId);
            System.out.println("==> [AnalysisController::resetUnderstanding 끝] 넘겨준 값 resetResponseDto =" + resetResponseDto);

            return ResponseEntity.ok(resetResponseDto);
        } catch (Exception e) {
            System.out.println("==> [AnalysisController::resetUnderstanding] 예외발생 " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResetResponseDto(null, null, null,  null,"초기화 중 오류 발생: " + e.getMessage()));
        }
    }

    //library에 뿌려주기
    @GetMapping("/analysis-records/my")
    public ResponseEntity<Page<AnalysisRecordDto>> getMyAnalysisRecords(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                        @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "10") int size) {
        System.out.println("==> [AnalysisController::analysis-records/my 시작] ");

        Long currentUserId = userDetails.getUser().getUserId(); // 또는 userDetails.getId()
        //System.out.println("==> [AnalysisController::analysis-records/my ::currentUserId] ===>" + currentUserId);


        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AnalysisRecord> recordsPage = analysisRecordRepository.findVisibleRecordsByUserId(currentUserId, pageable);
        //System.out.println("==> [AnalysisController::analysis-records/my ::recordsPage] ===>" + recordsPage);
        Page<AnalysisRecordDto> dtoPage = recordsPage.map(record -> {
            int noteCount = analysisNoteRepository.countByAnalysisRecordId(record.getId());
            return AnalysisRecordDto.from(record, noteCount);
        });

        //dtoPage.forEach(dto -> System.out.println("dto.isImportant = " + dto.getIsImportant()));

        System.out.println("[AnalysisController::analysis-records/my] dtoPage" + dtoPage);
        System.out.println("[AnalysisController::analysis-records/my 끝] ");
        return ResponseEntity.ok(dtoPage);
    }

    @PutMapping("/{id}/toggle-important") //중요도를 누르면 is_import 올라가기
    public ResponseEntity<?> toggleImportant(@PathVariable Long id) {
        try {
            boolean updated = analysisService.toggleImportant(id);
            return ResponseEntity.ok().body(Map.of("id", id, "isImportant", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "토글 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/{analysisId}/related")
    public ResponseEntity<Page<AnalysisRecord>> getRelated(
            @PathVariable Long analysisId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {

        System.out.println("[AnalysisController::{analysisId}/related] ==> 연관 글 조회 완료 ");
        return ResponseEntity.ok(analysisService.getRelatedAnalyses(analysisId, page, size));
    }

    @PatchMapping("/{id}/hide")
    public ResponseEntity<?> hideAnalysisRecord(@PathVariable Long id) {
        try {
            analysisService.hideAnalysisRecord(id);
            return ResponseEntity.ok().body(Map.of("id", id, "status", "hidden"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<?> restoreAnalysisRecord(@PathVariable Long id) {
        try {
            analysisService.restoreAnalysisRecord(id);
            return ResponseEntity.ok().body(Map.of("id", id, "status", "restored"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    //숨겨진 목록만 확인
    @GetMapping("/analysis-records/hidden")
    public ResponseEntity<Page<AnalysisRecordDto>> getHiddenAnalysisRecords(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                            @RequestParam(defaultValue = "0") int page,
                                                                            @RequestParam(defaultValue = "10") int size) {
        Long currentUserId = userDetails.getUser().getUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<AnalysisRecord> hiddenRecordsPage = analysisRecordRepository
                .findByCreatedByUserIdAndIsHiddenTrue(currentUserId, pageable);

        Page<AnalysisRecordDto> dtoPage = hiddenRecordsPage.map(record -> {
            int noteCount = analysisNoteRepository.countByAnalysisRecordId(record.getId());
            return AnalysisRecordDto.from(record, noteCount);
        });

        return ResponseEntity.ok(dtoPage);
    }

    //hidden 토탈 갯수 찾기
    @GetMapping("/analysis-records/hidden/count")
    public ResponseEntity<Long> countHiddenRecords(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUser().getUserId();
        long count = analysisRecordRepository.countByCreatedByUserIdAndIsHiddenTrue(userId);
        return ResponseEntity.ok(count);
    }

//    // POST /analysis/kosbert 요청 처리
//    @PostMapping("/kosbert")
//    public ResponseEntity<FastApiResponseDto> analyzeWithKoSBERT(@RequestBody FastApiRequestDto request) {
//        FastApiResponseDto result = fastApiService.requestAnalysis(request.getOriginal(), request.getUser());
//
//        System.out.println("[AnalysisController::kosbert ==> result " + result);
//        return ResponseEntity.ok(result);
//    }
}