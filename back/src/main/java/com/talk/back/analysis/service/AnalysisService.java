package com.talk.back.analysis.service;

import com.talk.back.analysis.dto.*;
import com.talk.back.analysis.entity.AnalysisRecord;
import com.talk.back.analysis.library.note.AnalysisNoteRepository;
import com.talk.back.analysis.repository.AnalysisRecordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class AnalysisService {

    private final AnalysisRecordRepository analysisRecordRepository;
    private final TextExtractor textExtractor;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AnalysisNoteRepository analysisNoteRepository;
    private final MatchEngine matchEngine; // KoSbertMatchEngine이 주입되도록

    //User_Id 를 Create_by로 들어가게 하기위해 변수 선언
    private final UserRepository userRepository;


    // 작성자 받아오기
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다."));
    }

    // originalText 를 가지고 subject 추출 하기 위한 선언 및 메서드

    private String generateSubject(String originalText) {
        if (originalText == null || originalText.isBlank()) return "";

        // 마침표, 줄바꿈 기준으로 첫 문장을 자르거나 없으면 앞 20자
        String firstSentence = originalText.split("[\\.\\n]")[0]; // "." or 줄바꿈 기준
        return firstSentence.length() > 20 ? firstSentence.substring(0, 20) + "..." : firstSentence;
    }

    @Transactional
    public AnalysisResponseDto analyzeAndSave(AnalysisRequestDto req) throws Exception {
        System.out.println("==> [AnalysisService::AnalysisResponseDto 시작] ");

        AnalysisResponseDto analysisResponseDto = null;



        // 1. 파일 처리
        String extracted = "";
        byte[] fileBytes = null;
        String fileName = null;
        String contentType = null;
        Long fileSize = null;

        MultipartFile file = req.getOriginalFile();
        if (file != null && !file.isEmpty()) {
            fileBytes   = file.getBytes();
            fileName    = file.getOriginalFilename();
            contentType = file.getContentType();
            fileSize    = file.getSize();

            extracted = textExtractor.extractTxt(fileBytes); // txt 가정
        }

        // 2. originalText 구성 (입력값 + 파일추출내용)
        String combinedOriginal = combine(req.getOriginalText(), extracted);

        // 3. 매칭 분석
        var result = matchEngine.analyze(combinedOriginal, req.getUserText() );
        String resultJson = objectMapper.writeValueAsString(result);

        // 4. 해시 생성 (해당 originalText로부터)
        String originalTextHash = DigestUtils.md5DigestAsHex(combinedOriginal.getBytes());

        int versionNo = analysisRecordRepository
                .findMaxVersionByOriginalTextHash(originalTextHash)
                .map(v -> v + 1)
                .orElse(0);

        // 5. subject 주제 입력 ( original text 첫 문장 추출 )
        String subject = generateSubject(req.getOriginalText());

        // 6. 현재 유저 확인 (비로그인 시 null)
        User currentUser = getCurrentUserIfLoggedIn();

        // 7. 저장
        AnalysisRecord record = null;
        if (currentUser != null) {
            // 로그인한 경우에만 저장
            record = AnalysisRecord.builder()
                    .originalText(combinedOriginal)
                    .originalTextHash(originalTextHash)
                    .versionNo(versionNo)
                    .userText(req.getUserText())
                    .resultJson(resultJson)
                    .originalFileBytes(fileBytes)
                    .originalFileName(fileName)
                    .originalFileContentType(contentType)
                    .originalFileSize(fileSize)
                    .createdBy(currentUser) // 작성자 정보 저장
                    .matchingRate(result.getMatchingRate()) // 매칭률 저장
                    .isImportant(false) // 기본은 false
                    .subject(subject) //자동 subject 설정
                    .build();


            System.out.println("[AnalysisService::AnalysisResponseDto] record = " + record);

            analysisRecordRepository.save(record);
        }
//        System.out.println("recordId = " + record.getId());
//        System.out.println("result = " + result);
//        System.out.println("createdAt = " + record.getCreatedAt());
//        System.out.println("originalText = " + record.getOriginalText());
//        System.out.println("originalTextHash = " + record.getOriginalTextHash());
//        System.out.println("versionNo = " + record.getVersionNo());

        // 7. 결과 반환
        analysisResponseDto = AnalysisResponseDto.builder()
                .recordId(record != null ? record.getId() : null) // 비회원은 null
                .result(result)
                .createdAt(LocalDateTime.now().toString())
                .originalText(combinedOriginal)
                .subject(subject)
                .build();

        System.out.println("==> [AnalysisService::AnalysisResponseDto 끝] analysisResponseDto = " + analysisResponseDto) ;

        return analysisResponseDto;
    }

    private String combine(String a, String b) {
        if ((a == null || a.isBlank()) && (b == null || b.isBlank())) return "";
        if (a == null || a.isBlank()) return b;
        if (b == null || b.isBlank()) return a;
        return a + "\n\n" + b;
    }

    @Transactional(readOnly = true)
    public AnalysisResponseDto getResult(Long id) throws Exception {
        System.out.println("==> [AnalysisService::getResult 시작] ");

        AnalysisResponseDto analysisResponseDto = null;

        AnalysisRecord record = analysisRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Not found: " + id));

        MatchDetailDto mtchDetailDto = objectMapper.readValue(record.getResultJson(), MatchDetailDto.class);
        System.out.println("[AnalysisService::getResult] MatchDetailDto = " + mtchDetailDto);

//        System.out.println("recordId = " + record.getId());
//        System.out.println("createdAt = " + record.getCreatedAt());
//        System.out.println("originalText = " + record.getOriginalText());
//        System.out.println("originalTextHash = " + record.getOriginalTextHash());
//        System.out.println("versionNo = " + record.getVersionNo());
        //이렇게 하나씩 출력하지 않고  AnalysisResponseDto analysisResponseDto = null; 선언하여 그 값 출력하면 한번에 확인가능
        //단 해당되는 타입 Dto에 @Tostring  필요함

        analysisResponseDto = AnalysisResponseDto.builder()
                .recordId(record.getId())
                .result(mtchDetailDto)
                .createdAt(record.getCreatedAt().toString())

                //250729 추가  <-- 추가 후 originalText와 userText 부분 값이 들어감
                .originalText(record.getOriginalText())
                .userText(record.getUserText())
                //250807 추가 <-- 중요도 추가
                .isImportant(record.isImportant())
                .build();

        System.out.println("==>[AnalysisService::getResult 끝] 넘겨준 값 analysisResponseDto = " + analysisResponseDto);

        return analysisResponseDto;
    }

    public ResetResponseDto resetUnderstanding(Long recordId) throws Exception {
        System.out.println("==> [AnalysisService::resetUnderstanding 시작] ");

        AnalysisRecord original = analysisRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("기록 없음"));

        // 버전이 0이면 초기화 처리하지 않음
        if (original.getVersionNo() == 0) {
            System.out.println("[resetUnderstanding] versionNo가 0이므로 초기화하지 않음");
            return ResetResponseDto.builder()
                    .newRecordId(original.getId())
                    .versionNo(original.getVersionNo())
                    .originalText(original.getOriginalText())
                    .originalTextHash(original.getOriginalTextHash())
                    .message("버전 0 기록은 초기화 대상이 아닙니다.")
                    .build();
        }

        String textHash = DigestUtils.md5DigestAsHex(original.getOriginalText().getBytes());

        Optional<AnalysisRecord> existingRecordOpt = analysisRecordRepository
                .findByOriginalTextHashAndVersionNo(textHash, 1);

        AnalysisRecord recordToUse;

        if (existingRecordOpt.isPresent()) {
            // 이미 초기화된 기록이 존재하면 그걸 update
            recordToUse = existingRecordOpt.get();
            recordToUse.setUserText("");
            recordToUse.setResultJson("{}");
            System.out.println("[resetUnderstanding] 기존 레코드 업데이트: id=" + recordToUse.getId());
        } else {
            // 없으면 새로 생성
            recordToUse = AnalysisRecord.builder()
                    .originalText(original.getOriginalText())
                    .originalTextHash(textHash)
                    .versionNo(1)
                    .userText("")
                    .resultJson("{}")
                    .build();
            System.out.println("[resetUnderstanding] 새로운 레코드 생성");
            analysisRecordRepository.save(recordToUse); // insert
        }

        ResetResponseDto resetResponseDto = ResetResponseDto.builder()
                .newRecordId(recordToUse.getId())
                .versionNo(recordToUse.getVersionNo())
                .originalText(original.getOriginalText())
                .originalTextHash(recordToUse.getOriginalTextHash())
                .message("초기화 완료")
                .build();

        System.out.println("==> [resetUnderstanding 끝] resetResponseDto = " + resetResponseDto);

        return resetResponseDto;
    }

    private User getCurrentUserIfLoggedIn() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    } //SecurityContextHolder는 Spring Security에서 현재 로그인한 사용자 정보를 확인할 때 씀.

    @Transactional
    public boolean toggleImportant(Long id) {

        AnalysisRecord record = analysisRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("분석 기록을 찾을 수 없습니다: " + id));

        boolean current = record.isImportant();
        record.setImportant(!current); // toggle
        System.out.println("==> [AnalysisService::toggleImportant] ---> 중요도 눌러짐 ");
        analysisRecordRepository.save(record); // 변경 저장
        return record.isImportant();
    }

    // 연관 대화 불러오는 메서드
    public Page<AnalysisRecord> getRelatedAnalyses(Long analysisId, int page, int size) {
        AnalysisRecord base = analysisRecordRepository.findById(analysisId)
                .orElseThrow(() -> new IllegalArgumentException("분석 기록 없음"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("versionNo").ascending());

        return analysisRecordRepository.findByOriginalTextHashAndIdNot(
                base.getOriginalTextHash(), base.getId(), pageable);
    }


    // noteCount 불러오기 메서드
    public List<AnalysisRecordDto> getMyAnalysisRecords(Long userId) {
        List<AnalysisRecord> records = analysisRecordRepository.findByCreatedByUserId(userId);

        return records.stream()
                .map(record -> {
                    int noteCount = analysisNoteRepository.countByAnalysisRecordId(record.getId());
                    return AnalysisRecordDto.from(record, noteCount);
                })
                .toList();
    }

    //라이브러리 숨기기

    @Transactional
    public void hideAnalysisRecord(Long id) {
        AnalysisRecord record = analysisRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("분석 기록을 찾을 수 없습니다: " + id));

        record.setIsHidden(true);
        record.setHiddenAt(LocalDateTime.now());

        analysisRecordRepository.save(record);
    }

    @Transactional
    public void restoreAnalysisRecord(Long id) {
        AnalysisRecord record = analysisRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("분석 기록을 찾을 수 없습니다: " + id));

        record.setIsHidden(false);
        record.setHiddenAt(null);

        analysisRecordRepository.save(record);
    }

//--------------------- 차후 정리
//    public ResetResponseDto resetUnderstanding(Long recordId) throws Exception {
//        System.out.println("==> [AnalysisService::resetUnderstanding 시작] ");
//
//        AnalysisRecord original = analysisRecordRepository.findById(recordId)
//                .orElseThrow(() -> new IllegalArgumentException("기록 없음"));
//
//        String textHash = DigestUtils.md5DigestAsHex(original.getOriginalText().getBytes());
//
//        // 버전 1짜리 동일한 텍스트 해시가 존재하는지 확인
//        Optional<AnalysisRecord> existingRecordOpt = analysisRecordRepository
//                .findByOriginalTextHashAndVersionNo(textHash, 1); // 0 밖에 없으므로
//
//        AnalysisRecord recordToUse;
//
//        if (existingRecordOpt.isPresent()) {
//            // 이미 초기화된 기록이 존재하면 그걸 update
//            recordToUse = existingRecordOpt.get();
//            recordToUse.setUserText("");
//            recordToUse.setResultJson("{}");
//            System.out.println("[AnalysisService::resetUnderstanding] 기존 레코드 업데이트: id=" + recordToUse.getId());
//        } else {
//            // 없으면 새로 생성
//            recordToUse = AnalysisRecord.builder()
//                    .originalText(original.getOriginalText())
//                    .originalTextHash(textHash)
//                    .versionNo(1)
//                    .userText("")
//                    .resultJson("{}")
//                    .build();
//            System.out.println("[AnalysisService::resetUnderstanding] 새로운 레코드 생성");
//        }
//
//        analysisRecordRepository.save(recordToUse); // insert or update
//
//        ResetResponseDto resetResponseDto = ResetResponseDto.builder()
//                .newRecordId(recordToUse.getId())
//                .versionNo(recordToUse.getVersionNo())
//                .originalText(original.getOriginalText())
//                .originalTextHash(recordToUse.getOriginalTextHash())
//                .message("초기화 완료")
//                .build();
//
//        System.out.println("==> [AnalysisService::resetUnderstanding 끝] resetResponseDto = " + resetResponseDto);
//
//        return resetResponseDto;
//    }

//    public ResetResponseDto resetUnderstanding(Long recordId) throws Exception {
//        System.out.println("==> [AnalysisService::resetUnderstanding 시작] ");
//
//        ResetResponseDto resetResponseDto = null;
//
//        AnalysisRecord original = analysisRecordRepository.findById(recordId)
//                .orElseThrow(() -> new IllegalArgumentException("기록 없음"));
//
//        String textHash = DigestUtils.md5DigestAsHex(original.getOriginalText().getBytes());
//
//        int maxVersion = analysisRecordRepository
//                .findMaxVersionByOriginalTextHash(textHash)
//                .orElse(0);
//
//        AnalysisRecord newRecord = AnalysisRecord.builder()
//                .originalText(original.getOriginalText())
//                .originalTextHash(textHash)
//                .versionNo(maxVersion + 1)
//                .userText("")     // 초기화
//                .resultJson("{}") // 초기화
//                .build();
//
//        analysisRecordRepository.save(newRecord);//처음 INSERT문 / 그다음 UPDATE문
//
//        System.out.println("newRecord = " + newRecord);
//
////        System.out.println("recordId = " + newRecord.getId());
////        System.out.println("createdAt = " + newRecord.getCreatedAt());
////        System.out.println("originalText = " + newRecord.getOriginalText());
////        System.out.println("originalTextHash = " + newRecord.getOriginalTextHash());
////        System.out.println("versionNo = " + newRecord.getVersionNo());
//
//        //방법-1 : 생성자
//        //resetResponseDto = new ResetResponseDto(newRecord.getId(), newRecord.getVersionNo(),  newRecord.getOriginalText(), newRecord.getOriginalTextHash(), "초기화 완료");
//
//        //방법-2 : @Builder 사용 --> .build()가 있어야함.
//        resetResponseDto = ResetResponseDto.builder() //기본값
//                .newRecordId(newRecord.getId())
//                .versionNo(newRecord.getVersionNo())
//                //.originalText(newRecord.getOriginalText())
//                .originalTextHash(newRecord.getOriginalTextHash())
//                .originalText(original.getOriginalText())
//                .originalTextHash(original.getOriginalTextHash())
//                .message("초기화 완성")
//                .build();
//
//        System.out.println("==> [AnalysisService::resetUnderstanding 끝] 넘겨준 값 resetResponseDto = " + resetResponseDto);
//
//        return resetResponseDto;
//    }

//public ResetResponseDto resetUnderstanding(Long recordId) throws Exception {
//    System.out.println("==> [AnalysisService::resetUnderstanding 시작] ");
//
//    AnalysisRecord record = analysisRecordRepository.findById(recordId)
//            .orElseThrow(() -> new IllegalArgumentException("기록 없음"));
//
//    // 기존 레코드의 userText, resultJson 초기화
//    record.setUserText("");
//    record.setResultJson("{}");
//
//    analysisRecordRepository.save(record); // update 쿼리 발생
//
//    ResetResponseDto resetResponseDto = ResetResponseDto.builder()
//            .newRecordId(record.getId()) // 기존 ID 그대로
//            .versionNo(record.getVersionNo())
//            .originalText(record.getOriginalText())
//            .originalTextHash(record.getOriginalTextHash())
//            .message("초기화 완료")
//            .build();
//
//    System.out.println("==> [AnalysisService::resetUnderstanding 끝] resetResponseDto = " + resetResponseDto);
//
//    return resetResponseDto;
//}



}

