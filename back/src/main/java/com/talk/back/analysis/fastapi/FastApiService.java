package com.talk.back.analysis.fastapi;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class FastApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    // properties에서 읽어오는 FastAPI 서버 주소
    @Value("${fastapi.url}")
    private String fastApiUrl;

    public FastApiResponseDto requestAnalysis(String originalText, String userText) {

        FastApiRequestDto requestDto = new FastApiRequestDto(originalText, userText);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<FastApiRequestDto> request = new HttpEntity<>(requestDto, headers);

        ResponseEntity<FastApiResponseDto> response =
                restTemplate.postForEntity(fastApiUrl, request, FastApiResponseDto.class);

        return response.getBody();
    }
}