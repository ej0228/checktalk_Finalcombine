package com.talk.back.auth.entity;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


/**
 * CustomUserDetails
 * - Spring Security의 인증 시스템에서 사용자 정보를 담기 위한 클래스
 * - 우리가 만든 User 엔티티를 감싸서 UserDetails로 변환해주는 어댑터 역할
 * - 로그인 시 Security가 이 객체를 참조해서 인증/인가 수행
 */
@Getter
public class CustomUserDetails implements UserDetails {

    /** 우리가 만든 User 엔티티를 내부에 보유 */
    private final User user;

    /** 생성자: User 엔티티를 주입받아 저장 */
    public CustomUserDetails(User user) {
        this.user = user;
    }

    /**
     * 사용자의 권한 목록을 반환하는 메서드
     *
     * [역할]
     * - Spring Security의 인가(Authorization) 처리 시 사용자의 권한 정보를 제공합니다.
     * - 반환된 권한 목록은 SecurityContext에 저장되어, 접근 제어(@PreAuthorize, hasRole 등)에 활용됩니다.
     *
     * [구현 설명]
     * - 사용자 엔티티의 Role(Enum)을 기준으로 문자열 권한을 생성합니다.
     * - Spring Security는 권한 명칭 앞에 반드시 "ROLE_" 접두어를 붙이는 형식을 요구합니다.
     *   예: Role.USER → "ROLE_USER", Role.ADMIN → "ROLE_ADMIN"
     * - null 방지를 위해 Role가 지정되지 않은 경우 기본값으로 "USER" 권한을 사용합니다.
     *
     * [반환 형식]
     * - SimpleGrantedAuthority: 권한 문자열을 래핑한 Security 객체
     * - List<GrantedAuthority> 형태로 단일 권한을 반환
     *
     * [사용 예시]
     * - 인증 성공 후 SecurityContextHolder에 저장되어 접근 제어에 사용됨
     * - hasRole("ADMIN") 또는 @Secured("ROLE_USER") 등의 권한 검사에 활용됨
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = user.getRole() != null ? user.getRole().name() : "USER";
        return List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
    }

    /**
     * 사용자의 비밀번호 반환
     * - 로그인 시 입력된 비밀번호와 이 값을 비교함
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * 로그인에 사용할 사용자 ID (여기선 이메일 사용)
     */
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    /**
     * 계정 만료 여부 (true: 사용 가능)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 계정 잠김 여부 (true: 잠기지 않음)
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 비밀번호 만료 여부 (true: 만료되지 않음)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 계정 활성화 여부 (true: 사용 가능)
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}