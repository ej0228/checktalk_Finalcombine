package com.talk.back.auth.service;


// 스프링 시큐리티에서 사용할 사용자 정보 객체
import com.talk.back.auth.entity.CustomUserDetails;
// 사용자 엔티티 (DB에 저장된 사용자 정보)
import com.talk.back.auth.entity.User;
// 사용자 정보를 DB에서 조회하기 위한 JPA 인터페이스
import com.talk.back.auth.repository.UserRepository;

// 생성자 자동 생성 (final 필드에 대해)
import lombok.RequiredArgsConstructor;
// 스프링 시큐리티가 요구하는 사용자 정보 인터페이스
import org.springframework.security.core.userdetails.UserDetails;
// 사용자 인증 시 사용자 정보를 불러오는 인터페이스
import org.springframework.security.core.userdetails.UserDetailsService;
// 이메일로 사용자 못 찾았을 때 발생하는 예외
import org.springframework.security.core.userdetails.UsernameNotFoundException;
// 이 클래스를 스프링 빈으로 등록하기 위한 어노테이션
import org.springframework.stereotype.Service;


/** UserDetailsService 는 " 이 사용자 진짜 존재하나요? " 를 검증하는 핵심 인터페이스
 * 사용자 정보를 데이터베이스에서 조회하여 스프링 시큐리티에 제공하는 서비스 클래스
 * - JWT 인증 필터에서 사용자 정보를 이메일로 불러올 때 사용됨
 * - loadUserByUsername() 메서드를 오버라이드하여 구현
 */
@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // 사용자 정보를 조회할 리포지토리 (DB 접근용)
    private final UserRepository userRepository;


    /**
     * 사용자 이메일(email)을 기준으로 사용자 정보를 불러오는 메서드
     * - 스프링 시큐리티에서 인증 시 자동으로 호출됨
     * - JWT에서 추출한 이메일을 기반으로 DB에서 사용자 정보 조회
     *
     * @param email 사용자 이메일 (username 역할)
     * @return UserDetails 객체 (스프링 시큐리티 내부에서 인증에 사용됨)
     * @throws UsernameNotFoundException 해당 이메일이 존재하지 않는 경우 예외 발생
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 이메일로 사용자 조회 (Optional 사용)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("해당 이메일을 가진 사용자가 없습니다: " + email));

        // 조회된 사용자 엔티티를 UserDetails 형태로 변환하여 반환
        return new CustomUserDetails(user);
    }
}
