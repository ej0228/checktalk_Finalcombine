package com.talk.back.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/** 요청(Request)에 대한 로그를 기록하는 필터
 * RequestLoggingFilter 클래스
 * - 모든 HTTP 요청에 대해 한 번만 실행되는 로깅 필터
 * - 요청 메서드(GET, POST 등)와 URI를 콘솔에 출력함
 * - 디버깅, 모니터링, 추적 등에 활용 가능
 */
@Component // Spring이 자동으로 Bean으로 등록해서 필터로 사용함
public class RequestLoggingFilter extends OncePerRequestFilter {

    /**
     * doFilterInternal()
     * - 요청이 들어올 때마다 호출됨
     * - 요청 메서드와 경로를 로그로 출력
     * - 반드시 filterChain.doFilter() 호출해야 다음 필터나 컨트롤러로 요청이 전달됨
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 메서드와 경로 출력 (ex: GET /api/users)
        System.out.println("접근 로그: " + request.getMethod() + " " + request.getRequestURI());

        // ⛓️ 필터 체인을 계속 이어줘야 요청이 실제 컨트롤러까지 도달함!
        filterChain.doFilter(request, response);
    }
}