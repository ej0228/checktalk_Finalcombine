package com.talk.back.analysis.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class MatchDetailDto {
    private double matchingRate;
    private int    totalOriginalWords;
    private int    totalUserWords;
    private int    matchedWords;
    private List<String> keywordMatches;
    private List<String> missedKeywords;
    private List<String> extraKeywords;
    private int originalLength;
    private int userLength;
}