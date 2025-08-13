package com.talk.back.admin.init;

import com.talk.back.auth.entity.User;
import com.talk.back.auth.repository.UserRepository;
import com.talk.back.community.entity.Comment;
import com.talk.back.community.entity.CommentReport;
import com.talk.back.community.entity.ReportAction;
import com.talk.back.community.entity.ReportStatus;
import com.talk.back.community.repository.CommentReportRepository;
import com.talk.back.community.repository.CommentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;

/**
 * 🚀 커뮤니티 테스트용 더미 게시글 + 신고 자동 생성기
 *
 * 사용 목적:
 * - 서버 실행 시 자동으로 더미 게시글 5개를 생성
 * - 그 중 3번째 게시글부터는 신고 3건씩 자동 삽입
 * - 신고 사유 및 처리 상태도 함께 설정됨
 *
 * 전제 조건:
 * - user10@test.com 계정이 미리 회원가입되어 있어야 작동
 * - Spring Security 인증과는 무관 (PostConstruct는 필터 전에 실행됨)
 * - 필요하지 않을 경우 @Component 주석처리
 */
@Profile({"dev","local"})
//@Component
@RequiredArgsConstructor
public class CommunityTestDataInitializer {

    private final CommentRepository commentRepository;
    private final CommentReportRepository commentReportRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        // 테스트용 유저 계정 조회
        User user = userRepository.findByEmail("user10@test.com")
                .orElseThrow(() -> new RuntimeException("user10@test.com 계정을 찾을 수 없습니다."));

        // ✏️ 게시글 5개 생성
        for (int i = 1; i <= 5; i++) {
            boolean shouldHide = (i >= 3); // 3번째부터 신고된 글
            int reportCount = shouldHide ? 3 : 0;

            Comment comment = Comment.builder()
                    .user(user)
                    .content("더미 게시글 내용 " + i)
                    .reportCount(reportCount)
                    .hiddenByReport(shouldHide)
                    .deleted(false)
                    .createdAt(LocalDateTime.now().minusDays(i))
                    // ✅ 신고 상태값도 함께 설정
                    .reportStatus(shouldHide ? ReportStatus.PENDING : null)
                    .reportAction(shouldHide ? ReportAction.NONE : null)
                    .build();

            comment = commentRepository.save(comment); // DB 저장 후 ID 할당

            // ✅ 신고 데이터 자동 삽입
            if (shouldHide) {
                for (int j = 1; j <= 3; j++) {
                    CommentReport report = CommentReport.builder()
                            .user(user) // 동일 유저 → 실제 서비스에서는 다중 유저 권장
                            .comment(comment)
                            .reason("테스트 신고 사유 " + j)
                            .canceled(false)
                            .build();

                    commentReportRepository.save(report);
                }
            }
        }

        System.out.println("커뮤니티 더미 게시글 + 신고 포함 데이터 5건 생성 완료 ✅");
    }
}
