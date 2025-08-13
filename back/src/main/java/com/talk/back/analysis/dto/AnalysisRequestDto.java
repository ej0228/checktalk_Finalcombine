package com.talk.back.analysis.dto;


import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class AnalysisRequestDto {

    private String originalText;          // 첫 번째 박스 입력
    private String userText;              // 두 번째 박스 입력
    private MultipartFile originalFile;   // .txt 파일 (옵션)
    private Double matchingRate;

}