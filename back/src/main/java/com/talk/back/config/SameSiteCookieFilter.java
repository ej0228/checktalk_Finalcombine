package com.talk.back.config;

// 서블릿 필터 인터페이스 관련 클래스들
import jakarta.servlet.*;

// HTTP 응답 객체
import jakarta.servlet.http.HttpServletResponse;

// 스프링 빈 등록 어노테이션
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

/**
 * SameSiteCookieFilter 클래스
 * - 서버가 응답으로 보내는 JSESSIONID 쿠키에 SameSite 속성을 자동으로 붙여주는 필터
 * - SameSite 속성은 CSRF(사이트 간 요청 위조) 방지용으로 사용됨
 * - 브라우저 보안 정책이 강화되면서 SameSite 없는 쿠키는 기본적으로 차단되는 경우가 생김
 */
@Component // 스프링이 이 클래스를 자동으로 빈으로 등록해서 필터로 사용함
public class SameSiteCookieFilter implements Filter {

    /**
     * doFilter: 요청과 응답 사이에 개입해서 쿠키 헤더를 수정하는 메서드
     * - 요청(Request)와 응답(Response) 처리 흐름 사이에서 작동
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 먼저 다음 필터(혹은 컨트롤러)로 요청을 전달함
        chain.doFilter(request, response);

        // 응답(Response)이 HttpServletResponse인 경우에만 처리
        if (response instanceof HttpServletResponse res) {

            // 응답 헤더 중 "Set-Cookie" 헤더들 가져오기
            Collection<String> headers = res.getHeaders("Set-Cookie");

            // 여러 개의 쿠키가 있을 수 있으므로 반복 처리
            for (String header : headers) {

                // JSESSIONID 쿠키에만 SameSite 설정 추가 (이미 설정된 경우는 제외)
                if (header.contains("JSESSIONID") && !header.toLowerCase().contains("samesite")) {

                    // SameSite=Lax 추가 (Lax: 대부분의 일반 요청에 쿠키를 허용, 보안+호환성 조화)
                    res.setHeader("Set-Cookie", header + "; SameSite=Lax");
                }
            }
        }
    }
}