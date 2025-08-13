package com.talk.back.config;

// Spring Boot 내장 웹서버 (Tomcat)의 서블릿 설정에서 접근할 수 있는 인터페이스

import jakarta.servlet.SessionCookieConfig;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;




/**
 * CookieConfig 클래스
 * -서버에서 발급하는 세션 쿠기(JSESSIONID)의 속성을 커스터마이징하는 설정 클래스
 * -쿠키의 이름, 경로, 보안 속성 등을 직접 설정할 수 있음
 * -이 설정은 서버가 처음 시작될 때 한 번 적용
 */
@Configuration    //Spring이 이 클래스를 설정 클래스로 인식
public class CookieConfig {

    /**
     * initializer() 메서드
     * -서블릿 컨텍스트가 초기화될 때 실행되는 커스터마이징 로직을 담은 Bean
     * -ServletContextInitializer 인터페이스는 스프링 부트 내장 톰캣과 함께 작동
     * @return ServletContextInitializer (서블릿 초기 설정을 적용해주는 객체)
     */
    @Bean
    public ServletContextInitializer initializer() {
        //람다식 사용 : 서블릿 컨텐스트가 초기화될 때 이코드가 실행됨
        return servletContext -> {

            //세션 쿠키 설정 객체를 가져옴
            SessionCookieConfig sessionCookieConfig = servletContext.getSessionCookieConfig();

            //보안 설정 1: HttpOnly
            // → JavaScript에서 쿠키에 접근하지 못하도록 막음(XSS 보안 강화)
            sessionCookieConfig.setHttpOnly(true);

            //보안 설정 2: Secure
            // → HTTPS(보안 연결)에서만 쿠키를 전달하도록 설정
            // → 개발 환경에서는 HTTP를 쓰므로 false로 설정
            // → 운영 환경에서는 반드시 true로 바꿔야 함!
            sessionCookieConfig.setSecure(false);

            //쿠키 경로 설정
            // → "/"로 설정하면 사이트 전체 URL에 대해 쿠키가 유효함
            sessionCookieConfig.setPath("/");

            //쿠키 이름 설정
            // → 기본값은 "JSESSIONID"이지만 명시적으로 지정함
            sessionCookieConfig.setName("JSESSIONID");
        };
    }
}
