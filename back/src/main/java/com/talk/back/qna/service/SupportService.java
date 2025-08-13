package com.talk.back.qna.service;

import com.talk.back.admin.entity.AdminSupportAnswer;
import com.talk.back.admin.repository.AdminSupportAnswerRepository;
import com.talk.back.auth.entity.User;
import com.talk.back.qna.dto.SupportFileDto;
import com.talk.back.qna.dto.SupportPostCreateDto;
import com.talk.back.qna.dto.SupportPostResponseDto;
import com.talk.back.qna.dto.SupportPostUpdateDto;
import com.talk.back.qna.entity.SupportFile;
import com.talk.back.qna.entity.SupportPost;
import com.talk.back.qna.repository.SupportPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportService {

    private final SupportPostRepository postRepository;
    private final AdminSupportAnswerRepository answerRepository;


    @Value("${file.upload-dir}")
    private String uploadDir;

    public SupportPostResponseDto createPost(SupportPostCreateDto dto, User user) {
        SupportPost post = new SupportPost();
        post.setType(dto.getType());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setUser(user);
        post.setStatus("처리중");
        post.setNewPost(dto.isNewPost());
        post.setColorIndex(dto.getColorIndex());
        post.setViews(0);



        MultipartFile[] files = dto.getFiles();
        List<SupportFile> fileEntities = new ArrayList<>();

        if (files != null && files.length > 0) {

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFilename = file.getOriginalFilename();
                    String savedName = UUID.randomUUID() + "_" + originalFilename;
                    File dest = new File(uploadDir, savedName);

                    try {
                        file.transferTo(dest);

                        SupportFile fileEntity = new SupportFile();
                        fileEntity.setOriginalName(originalFilename);
                        fileEntity.setSavedName(savedName);
                        fileEntity.setFilePath("/uploads/support/" + savedName); // URL 경로만 저장
                        fileEntity.setPost(post);

                        fileEntities.add(fileEntity);
                    } catch (IOException e) {
                        throw new RuntimeException("파일 저장 실패: " + originalFilename, e);
                    }
                }
            }
        }

        post.setFiles(fileEntities);
        SupportPost saved = postRepository.save(post);
        return toPostResponseDto(saved, null);
    }

    /**
     * 사용자용 전체 글 조회 (공지 포함)
     * 일반 사용자는 visible 필터링 없이 모두 조회
     */
    public List<SupportPostResponseDto> getAllPosts(User user) {
        if (user == null) {
            // 비로그인 사용자: 공지사항만 보여주기
            List<SupportPost> notices = postRepository.findByTypeOrderByCreatedAtDesc("notice");
            return notices.stream()
                    .map(post -> toPostResponseDto(post, answerRepository.findByPostId(post.getId()).orElse(null)))
                    .collect(Collectors.toList());
        }

        // 로그인 사용자: 공지사항 + 본인 글만 보여주기
        List<SupportPost> notices = postRepository.findByTypeOrderByCreatedAtDesc("notice");
        List<SupportPost> userPosts = postRepository.findByUserUserId(user.getUserId());

        List<SupportPost> combined = new ArrayList<>();
        combined.addAll(notices);
        combined.addAll(userPosts);

        return combined.stream()
                .map(post -> toPostResponseDto(post, answerRepository.findByPostId(post.getId()).orElse(null)))
                .collect(Collectors.toList());
    }

    /**
     * 사용자 본인 글만 조회
     */
    public List<SupportPostResponseDto> getUserPosts(Long userId) {
        List<SupportPost> posts = postRepository.findByUserUserId(userId);

        return posts.stream()
                .map(post -> {
                    Optional<AdminSupportAnswer> answerOpt = answerRepository.findByPostId(post.getId());
                    return toPostResponseDto(post, answerOpt.orElse(null));
                })
                .collect(Collectors.toList());
    }

    public SupportPostResponseDto getPostById(Long id, User viewer) {
        SupportPost post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 글이 존재하지 않습니다 🤪"));

        post.setViews(post.getViews() + 1);

        if (viewer != null && viewer.isAdmin() && "처리중".equals(post.getStatus())) {
            post.setStatus("확인중");
            postRepository.save(post);
        }

        Optional<AdminSupportAnswer> answerOpt = answerRepository.findByPostId(id);
        return toPostResponseDto(post, answerOpt.orElse(null));
    }

    public void updateStatus(Long postId, String status) {
        SupportPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 글이 존재하지 않습니다"));
        post.setStatus(status);
    }

    public void updatePost(Long id, SupportPostUpdateDto dto, User user) {
        SupportPost post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));

        if (!post.getUser().getUserId().equals(user.getUserId())) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        postRepository.save(post);
    }

    private SupportPostResponseDto toPostResponseDto(SupportPost post, AdminSupportAnswer answer) {
        return SupportPostResponseDto.builder()
                .id(post.getId())
                .type(post.getType())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getUser() != null ? post.getUser().getName() : "알 수 없음")
                .authorEmail(post.getUser() != null ? post.getUser().getEmail() : "")
                .authorPhone(post.getUser() != null ? post.getUser().getPhone() : "")
                .authorUserId(post.getUser() != null ? post.getUser().getUserId() : null)  // 작성자 고유 ID 추가
                .status(post.getStatus())
                .isNewPost(post.isNewPost())
                .colorIndex(post.getColorIndex())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .files(
                        post.getFiles().stream()
                                .map(file -> SupportFileDto.builder()
                                        .originalName(file.getOriginalName())
                                        .savedName(file.getSavedName())
                                        .filePath(file.getFilePath())
                                        .build())
                                .collect(Collectors.toList())
                )
                .answerContent(answer != null ? answer.getContent() : null)
                .build();
    }
}
