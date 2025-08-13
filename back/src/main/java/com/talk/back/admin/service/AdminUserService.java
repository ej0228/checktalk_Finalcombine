package com.talk.back.admin.service;

import jakarta.persistence.EntityNotFoundException;
import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    // [1] 사용자 페이징 검색 (이메일, 이름)
    public Page<User> searchUsers(String type, String keyword, Pageable pageable) {
        System.out.println("✅ 검색 타입: " + type + ", 키워드: " + keyword);

        if ("email".equalsIgnoreCase(type)) {
            System.out.println("📦 이메일 조건 검색 실행");
            return userRepository.findByEmailContainingAndDeleted(keyword, "N", pageable);
        } else if ("name".equalsIgnoreCase(type)) {
            System.out.println("📦 이름 조건 검색 실행");
            return userRepository.findByNameContainingAndDeleted(keyword, "N", pageable);
        } else {
            throw new IllegalArgumentException("지원하지 않는 검색 타입입니다.");
        }
    }




    // [2] 삭제되지 않은 사용자 목록
    public Page<User> getActiveUsersPaged(Pageable pageable) {
        return userRepository.findByDeleted("N", pageable);
    }

    // [3] 사용자 소프트 딜리트
    @Transactional
    public void softDeleteUser(Long userId) {
        User user = userRepository.findByUserIdAndDeleted(userId, "N")
                .orElseThrow(() -> new EntityNotFoundException("유저를 찾을 수 없습니다."));
        user.setDeleted("Y");
        userRepository.save(user);
    }

    // [4] 사용자 복구
    @Transactional
    public void restoreUser(Long userId) {
        User user = userRepository.findByUserIdAndDeleted(userId, "Y")
                .orElseThrow(() -> new EntityNotFoundException("삭제된 유저를 찾을 수 없습니다."));
        user.setDeleted("N");
        userRepository.save(user);
    }
}
