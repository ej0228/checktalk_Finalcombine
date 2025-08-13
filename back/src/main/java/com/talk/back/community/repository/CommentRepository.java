package com.talk.back.community.repository;

import com.talk.back.community.entity.Comment;
import com.talk.back.community.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 삭제되지 않은 글만 최신순으로 페이징 조회
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.deleted = false ORDER BY c.createdAt DESC")
    Page<Comment> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);


    // 관리자 모드 : ✅ ReportStatus가 NULL이 아닌 신고된 게시글 모두 조회 (처리 대기 + 처리 완료)
    Page<Comment> findByReportCountGreaterThanEqualAndHiddenByReportTrueOrReportStatus(
            int count, ReportStatus status, Pageable pageable
    );

    // 관리자 모드: 처리 상태(PENDING/RESOLVED)로 필터링된 신고글 조회
    Page<Comment> findByReportCountGreaterThanEqualAndHiddenByReportTrueAndReportStatus(
            int count, ReportStatus status, Pageable pageable
    );






}
