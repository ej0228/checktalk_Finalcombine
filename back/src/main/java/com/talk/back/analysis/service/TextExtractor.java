package com.talk.back.analysis.service;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class TextExtractor {
    // 현재는 .txt만 처리 (요구사항 기준)
    public String extractTxt(byte[] fileBytes) throws IOException {
        return new String(fileBytes, StandardCharsets.UTF_8);
    }
}