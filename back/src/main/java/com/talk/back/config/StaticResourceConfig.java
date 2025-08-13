package com.talk.back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * StaticResourceConfig
 * - Spring Boot에서 특정 폴더의 파일을 웹 경로로 노출시키기 위한 설정 클래스
 * - 예: 업로드된 이미지, 첨부파일을 브라우저에서 볼 수 있게 함 (고객센터, 커뮤니티 게시글 첨부파일, 프로필 이미지 등등)
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${file.resource-location}")
    private String resourceLocation;

    /**
     * addResourceHandlers()
     * - URL 경로와 실제 파일 시스템 경로를 매핑해주는 메서드
     * - 예: http://localhost:8080/uploads/support/sample.jpg
     *       → C:/work/test2/public/uploads/support/sample.jpg 로 연결
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                // 브라우저 요청 경로
                .addResourceHandler("/uploads/support/**")
                // 실제 파일이 저장된 물리 경로 (Window 파일 시스템 경로)
                .addResourceLocations(resourceLocation);
    }
}