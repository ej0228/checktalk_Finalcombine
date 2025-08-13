package com.talk.back.admin.notice.service;

import com.talk.back.admin.entity.AdminUser;
import com.talk.back.admin.notice.dto.AdminNoticeCreateDto;
import com.talk.back.admin.notice.dto.AdminNoticeResponseDto;
import com.talk.back.admin.notice.dto.AdminNoticeUpdateDto;
import com.talk.back.admin.notice.entity.AdminNotice;
import com.talk.back.admin.notice.repository.AdminNoticeRepository;
import com.talk.back.admin.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminNoticeServiceImpl implements AdminNoticeService {

    private final AdminNoticeRepository adminNoticeRepository;
    private final AdminUserRepository adminUserRepository;

    /**
     * 공지사항 등록
     */
    @Override
    public AdminNoticeResponseDto create(AdminNoticeCreateDto dto, Long adminId) {
        AdminUser writer = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정이 없습니다: " + adminId));

        AdminNotice notice = AdminNotice.builder()
                .title(dto.title())
                .content(dto.content())
                .pinned(dto.pinned() == null ? true : dto.pinned())  // 기본 true로 고정
                .visible(dto.visible() == null || dto.visible())
                .writer(writer)
                .build();

        return toDto(adminNoticeRepository.save(notice));
    }

    /**
     * 공지사항 수정
     */
    @Override
    public AdminNoticeResponseDto update(Long id, AdminNoticeUpdateDto dto) {
        AdminNotice n = adminNoticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항이 존재하지 않습니다: " + id));
        n.setTitle(dto.title());
        n.setContent(dto.content());
        if (dto.pinned() != null) n.setPinned(dto.pinned());
        if (dto.visible() != null) n.setVisible(dto.visible());
        return toDto(n);
    }

    /**
     * 공지사항 삭제
     */
    @Override
    public void delete(Long id) {
        if (!adminNoticeRepository.existsById(id)) {
            throw new IllegalArgumentException("삭제할 공지사항이 존재하지 않습니다: " + id);
        }
        adminNoticeRepository.deleteById(id);
    }

    /**
     * 공지사항 단건 조회
     */
    @Override
    @Transactional(readOnly = true)
    public AdminNoticeResponseDto get(Long id) {
        return adminNoticeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("공지사항이 존재하지 않습니다: " + id));
    }

    /** 공지사항 전체 목록(관리자): pinned desc → createdAt desc */
    @Override
    @Transactional(readOnly = true)
    public Page<AdminNoticeResponseDto> list(Pageable pageable) {
        // visible=true만, pinned desc → createdAt desc 정렬 유지
        // 정렬은 컨트롤러 @PageableDefault 로도 들어오므로, repository 쿼리는 where만 책임지도록 구성
        return adminNoticeRepository.findByVisibleTrue(pageable)
                .map(AdminNoticeResponseDto::from);
    }



    @Override
    public List<AdminNoticeResponseDto> list() {
        var sort = Sort.by(Sort.Direction.DESC, "pinned", "createdAt");
        return adminNoticeRepository.findByVisibleTrue(sort)
                .stream()
                .map(AdminNoticeResponseDto::from)
                .toList();
    }



    /**
     * 공지사항 고정 여부 토글
     */
    @Override
    public AdminNoticeResponseDto togglePin(Long id, boolean pinned) {
        AdminNotice n = adminNoticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항이 존재하지 않습니다: " + id));
        n.setPinned(pinned);
        return toDto(n);
    }

    /**
     * Entity → DTO 변환
     */
    private AdminNoticeResponseDto toDto(AdminNotice n) {
        return new AdminNoticeResponseDto(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.isPinned(),
                n.isVisible(),
                n.getWriter() != null ? n.getWriter().getUsername() : null,
                n.getCreatedAt(),
                n.getUpdatedAt()
        );
    }
}
