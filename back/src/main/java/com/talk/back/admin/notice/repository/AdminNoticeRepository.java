package com.talk.back.admin.notice.repository;

import com.talk.back.admin.notice.entity.AdminNotice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminNoticeRepository extends JpaRepository<AdminNotice, Long> {
    // ✅ Pageable 지원 메서드 (Spring Data JPA 표준 패턴)
    Page<AdminNotice> findByVisibleTrue(Pageable pageable); // 관리자 목록용

    java.util.List<AdminNotice> findByVisibleTrue(Sort sort); // 배너/간단목록용
}

