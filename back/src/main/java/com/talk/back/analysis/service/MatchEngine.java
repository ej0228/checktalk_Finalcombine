package com.talk.back.analysis.service;


import com.talk.back.analysis.dto.MatchDetailDto;

public interface MatchEngine {
    MatchDetailDto analyze(String originalText, String userText);
}