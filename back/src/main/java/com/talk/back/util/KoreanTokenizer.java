package com.talk.back.util;

import java.util.*;
import java.util.regex.Pattern;

/**
 * 매우 단순한 한글 토크나이저 (2글자 이상 한글만 추출)
 * 필요 시 형태소 분석기 교체 가능
 */
public class KoreanTokenizer {
    private static final Pattern WORD_PATTERN = Pattern.compile("[가-힣]{2,}");

    public static List<String> tokenize(String text) {
        if (text == null) return Collections.emptyList();
        var m = WORD_PATTERN.matcher(text.toLowerCase());
        List<String> words = new ArrayList<>();
        while (m.find()) {
            words.add(m.group());
        }
        return words;
    }
}