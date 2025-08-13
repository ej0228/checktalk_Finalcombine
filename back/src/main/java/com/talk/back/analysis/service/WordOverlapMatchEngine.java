package com.talk.back.analysis.service;


import com.talk.back.analysis.dto.MatchDetailDto;
import com.talk.back.util.KoreanTokenizer;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class WordOverlapMatchEngine implements MatchEngine {

    @Override
    public MatchDetailDto analyze(String originalText, String userText) {
        List<String> oWords = KoreanTokenizer.tokenize(originalText);
        List<String> uWords = KoreanTokenizer.tokenize(userText);

        Set<String> oSet = new HashSet<>(oWords);
        Set<String> uSet = new HashSet<>(uWords);

        Set<String> intersection = oSet.stream()
                .filter(uSet::contains)
                .collect(Collectors.toSet());

        Set<String> originalOnly = oSet.stream()
                .filter(w -> !uSet.contains(w))
                .collect(Collectors.toSet());

        Set<String> userOnly = uSet.stream()
                .filter(w -> !oSet.contains(w))
                .collect(Collectors.toSet());

        double matchingRate = (intersection.size() /
                (double) Math.max(oSet.size(), uSet.size())) * 100.0;

        return MatchDetailDto.builder()
                .matchingRate(Math.round(matchingRate * 100.0) / 100.0)
                .totalOriginalWords(oSet.size())
                .totalUserWords(uSet.size())
                .matchedWords(intersection.size())
                .keywordMatches(intersection.stream().limit(10).toList())
                .missedKeywords(originalOnly.stream().limit(10).toList())
                .extraKeywords(userOnly.stream().limit(10).toList())
                .originalLength(originalText.length())
                .userLength(userText.length())
                .build();
    }
}