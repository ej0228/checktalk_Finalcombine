package com.talk.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



/**
 * WebConfig 클래스
 * - CORS(Cross-Origin Resource Sharing) 허용 설정
 * - React SPA(싱글 페이지 애플리케이션)의 새로고침 404 오류 방지 설정
 */
@Configuration
 public class WebConfig implements WebMvcConfigurer {

    /**
     * SPA(Single Page Application) fallback 설정
     * - React 앱에서 사용자가 직접 URL 입력하거나 새로고침할 때,
     *   Spring이 404를 반환하는 대신 항상 index.html을 반환하도록 함
     * - 정적 리소스가 없는 경로라도 클라이언트 라우팅으로 이어지게 보장함
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[a-zA-Z0-9\\-_]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[a-zA-Z0-9\\-_]+}")
                .setViewName("forward:/index.html");
    }
 }
