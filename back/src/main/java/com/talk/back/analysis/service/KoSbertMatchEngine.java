package com.talk.back.analysis.service;

import com.talk.back.analysis.dto.MatchDetailDto;
import com.talk.back.analysis.fastapi.FastApiResponseDto;
import org.springframework.context.annotation.Primary;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Primary
@Component
public class KoSbertMatchEngine implements MatchEngine {

    private final RestTemplate restTemplate;

    public KoSbertMatchEngine() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public MatchDetailDto analyze(String originalText, String userText) {
        Map<String, String> request = new HashMap<>();
        request.put("original", originalText);
        request.put("user", userText);

        try {
            ResponseEntity<FastApiResponseDto> response = restTemplate.postForEntity(
                    "http://localhost:8046/analyze",  // FastAPI 주소
                    request,
                    FastApiResponseDto.class
            );

            FastApiResponseDto body = response.getBody();
            if (body == null) {
                throw new RuntimeException("FastAPI 응답이 null입니다.");
            }

            double matchingRate = body.getMatchingRate();  // 이제 제대로 접근 가능


            return MatchDetailDto.builder()
                    .matchingRate(matchingRate)
                    .totalOriginalWords(originalText.length()) // 문맥 분석이므로 단어 수는 의미 없음
                    .totalUserWords(userText.length())
                    .matchedWords(0)
                    .keywordMatches(List.of())  // 문맥 기반은 키워드 없음
                    .missedKeywords(List.of())
                    .extraKeywords(List.of())
                    .originalLength(originalText.length())
                    .userLength(userText.length())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("KoSBERT 서버 요청 실패: " + e.getMessage(), e);
        }
    }
}