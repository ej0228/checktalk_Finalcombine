package com.talk.back.community.entity;

import jakarta.persistence.*;
import com.talk.back.auth.entity.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    // 작성자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 로그인 유저와 연결

    //댓글 본문
    @Column(nullable = false, length = 1000)
    private String content;

    //좋아요 수
    @Builder.Default
    @Column(nullable = false)
    private int likeCount = 0;

    // 좋아요 수 증가
    public void increaseLikeCount() {
        this.likeCount++;
    }

    // 좋아요 수 감소 (0 이하로는 떨어지지 않게)
    public void decreaseLikeCount() {
        this.likeCount = Math.max(0, this.likeCount - 1);
    }

    //신고 수
    @Builder.Default
    private int reportCount = 0;

    //삭제 여부 → 삭제 요청이 들어오면 실제 삭제 대신 숨김
    @Builder.Default
    private boolean deleted = false;

    //작성/수정 시간
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }



    // 관리자 모드용 필드
    // 사용자가 신고 3회 이상 받을 경우 true로 설정되고, 일반 사용자에겐 보이지 않음
    // 관리자에 의해 복구되면 false로 되돌아감
    @Column(nullable = false)
    @Builder.Default
    private boolean hiddenByReport = false;


    // ✅ 댓글(Comment)과 신고(CommentReport)의 1:N 양방향 연관관계 설정
    // - 하나의 댓글은 여러 개의 신고를 받을 수 있음 (1:N 관계)
    // - mappedBy: CommentReport 엔티티의 'comment' 필드가 연관관계의 주인임을 명시
    // - cascade = ALL: 댓글이 저장/삭제될 때 관련된 신고도 함께 저장/삭제됨
    // - orphanRemoval = true: 댓글에서 신고 리스트에서 제거되면 DB에서도 해당 신고 레코드 삭제됨
    // - builder() 사용 시 null 방지 위해 @Builder.Default로 초기화 유지
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CommentReport> reports = new ArrayList<>();

    // 신고된 게시글의 처리 진행 상태
    // ✅ 처리 상태: 대기 / 완료
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportStatus reportStatus = ReportStatus.PENDING; // 기본값

    // 신고된 게시글의 처리 결과
    // ✅ 처리 결과: 복구 / 삭제
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportAction reportAction = ReportAction.NONE;


}