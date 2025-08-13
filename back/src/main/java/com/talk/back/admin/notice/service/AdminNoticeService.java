package com.talk.back.admin.notice.service;

import com.talk.back.admin.notice.dto.AdminNoticeCreateDto;
import com.talk.back.admin.notice.dto.AdminNoticeResponseDto;
import com.talk.back.admin.notice.dto.AdminNoticeUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminNoticeService {
    AdminNoticeResponseDto create(AdminNoticeCreateDto dto, Long adminId);
    AdminNoticeResponseDto update(Long id, AdminNoticeUpdateDto dto);
    void delete(Long id);
    AdminNoticeResponseDto get(Long id);
    // ✅ 페이지네이션 버전
    Page<AdminNoticeResponseDto> list(Pageable pageable);

    // ✅ 기존 무인자 호출 호환(배너/사용자용)
    List<AdminNoticeResponseDto> list();

    AdminNoticeResponseDto togglePin(Long id, boolean pinned);
}
