package com.talk.back.config;



// Spring의 설정 클래스로 등록, Bean 객체들을 구성
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// Spring Security에서 인증을 처리할 핵심 클래스
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
// 비밀번호 암호화를 위한 클래스
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
// 보안 필터 체인을 구성하는 클래스
import org.springframework.security.web.SecurityFilterChain;
// 세션 기반 인증일 때 SecurityContext를 세션에 저장하는 클래스
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

// CORS 허용을 위한 설정
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// 이 클래스는 보안 설정을 위한 구성 클래스이며, 스프링이 자동으로 감지

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // 🔵 공통 영역: 비밀번호 암호화를 위한 Bean (JWT에서도 유지)
    /**
     * 사용자의 비밀번호를 암호화하여 저장하거나,
     * 로그인 시 암호화된 비밀번호와 비교할 때 사용됨
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // 🔵 공통 영역: 사용자 인증 시 사용할 AuthenticationManager (JWT에서도 유지)
    /**
     * 로그인 시 이메일 + 비밀번호로 사용자를 인증할 때 사용되는 Spring Security 기본 인증 도구
     * 'AuthenticationConfiguration'으로부터 Bean을 받아와 사용
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }



    // 🔵 공통 영역: CORS 설정 (프론트엔드 도메인 접근 허용 / JWT에서도 유지)
    /**
     * 다른 도메인에서 API 요청이 가능하도록 허용함 (예: React 프론트엔드에서 이 서버로 요청)
     * 클라이언트 주소를 명시적으로 허용해야 브라우저의 보안 정책(CORS)을 통과할 수 있음
     */
    @Value("${spring.profiles.active:dev}") // 기본값 dev
    private String activeProfile;
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // 요청에 자격 증명 (예: 쿠키, Authorization 헤더 등)을 포함할 수 있도록 허용 withCredentials: true
        if ("prod".equals(activeProfile)) {config.setAllowedOriginPatterns(List.of("https://checktalk.dxcom.co.kr"));
        } else {
            config.setAllowedOriginPatterns(List.of("http://localhost:5173"));
        }
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);           // 모든 요청 경로에 대해 위 CORS 설정을 적용
        return source;
    }


// 🔵+🔴 혼합: 보안 필터 체인 설정
/**
 * 인증 방식, 세션 사용 여부, 접근 제어 규칙 등을 정의함
 */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // 프론트 엔드에서 온 요청이 허용되도록 CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // REST API에서 보편적으로 사용하는 CSRF 방지 비활성화
                //JWT는 자체적으로 위조 방지 기능이 있으므로 필요 없음
                .csrf(csrf -> csrf.disable())

                // 각 요청 경로에 대해 인증이 필요한 지 여부를 지정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() //OPTIONS 허용!
                        // ✅ 비로그인 상태에서 접근 허용
                        .requestMatchers(HttpMethod.POST, "/email/send").permitAll()
                        .requestMatchers(HttpMethod.POST, "/email/verify").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/password/reset").permitAll()

                        .requestMatchers("/uploads/**").permitAll() // ✅ 이미지 파일은 모두 허용
                        //분석
                        .requestMatchers(HttpMethod.POST, "/analysis/start").permitAll()

                        // 사용자 인증/비인증 경로 (순서 중요) : 각 요청 경로에 대해 인증이 필요한 지 여부를 지정
                        .requestMatchers("/users/mypage").authenticated()
                        .requestMatchers("/users/session-expired").permitAll()
                        .requestMatchers("/users/check-email").permitAll()
                        .requestMatchers("/library/**").authenticated()
                        .requestMatchers("/community/**").authenticated()
                        .requestMatchers("/support/**").authenticated()
                        .requestMatchers("/users/password/**").permitAll()
                        .requestMatchers("/users/login").permitAll() //이거도 명확히 있어야 함!
                        .requestMatchers("/users/signup").permitAll()

                        // 사용자 공개 공지(읽기)
                        .requestMatchers(HttpMethod.GET, "/support/notices/**").permitAll()
                        // (관리자 작성/수정/삭제는 /admin/notice/** 그대로 유지)
                                // 공개 목록/상세
                        // (쓰기/수정/삭제는 없음. 관리자만 /admin/notice/**에서 처리)

                        // 관리자 전용
                        .requestMatchers("/admin/login").permitAll()            // 로그인만 허용
                        .requestMatchers("/admin/**").hasRole("ADMIN")          // admin 영역 인증 필요

                        .anyRequest().authenticated() // 그 외는 인증 필요
                )

                // 🔴 세션 기반: SecurityContext를 세션에서 저장하고 복원하기 위한 설정
                .securityContext(security ->  // 이거 추가해야 세션에서 복원됨!!
                        security.securityContextRepository(securityContextRepository())
                )

                // 🔴 세션 기반: 세션 생성 정책 (IF_REQUIRED → 요청에 따라 세션을 만들 수 있음)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                // 🔴 세션 기반: 인증 실패 시 로그인 페이지로 리다이렉트
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"error\":\"unauthorized\"}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"error\":\"forbidden\"}");
                        })
                )

                // 🔴 기본 로그인(formLogin), HTTP Basic 로그인 제거 가능
                .build();
    }

// 🔴 세션 기반: SecurityContext(인증된 사용자 정보)를 세션에 저장하고 복원하기 위한 저장소
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }


}