package com.talk.back.admin.repository;

import com.talk.back.admin.entity.AdminSupportAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminSupportAnswerRepository extends JpaRepository<AdminSupportAnswer, Long> {

    // 질문글 ID로 답변을 찾기
    Optional<AdminSupportAnswer> findByPostId(Long postId);
}
