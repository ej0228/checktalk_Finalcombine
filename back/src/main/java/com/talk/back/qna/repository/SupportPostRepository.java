package com.talk.back.qna.repository;

import com.talk.back.qna.entity.SupportPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupportPostRepository extends JpaRepository<SupportPost, Long> {

    List<SupportPost> findByTypeOrderByCreatedAtDesc(String type);

    // 유저 본인 글 + 관리자가 작성한 글 가져오기
    @Query("SELECT p FROM SupportPost p WHERE p.user.userId = :userId OR p.user.role = 'ADMIN'")
    List<SupportPost> findByUserIdOrAdminPosts(@Param("userId") Long userId);

    // 관리자 페이지용 페이징 지원
    Page<SupportPost> findAllByOrderByCreatedAtDesc(Pageable pageable); // 기본 전체 조회
    Page<SupportPost> findByStatus(String status, Pageable pageable);   // 특정 상태 조회
    Page<SupportPost> findByStatusNot(String status, Pageable pageable); // 특정 상태 제외 조회

    // 답변 대기 상태 글 개수 (처리완료가 아닌 글 개수)
    long countByStatusNot(String status);

    // 추가로 사용자 본인 글만 조회하는 메서드
    List<SupportPost> findByUserUserId(Long userId);
}
