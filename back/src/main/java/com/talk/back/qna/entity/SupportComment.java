package com.talk.back.qna.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * ⚠️ 사용자 댓글 기능은 현재 사용하지 않음.
 *    관리자 답변은 admin 패키지의 AdminSupportAnswer로 분리됨.
 *    추후 확장 가능성을 고려해 삭제하지 않고 주석 처리하여 보관 중.
 */

//@Entity
@Getter
@Setter
public class SupportComment {

    //@Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "post_id", nullable = false)
    private SupportPost post;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "user_id", nullable = false) // 작성자: User 기반
    //private User user;

    //@Lob
    private String content;

    private LocalDateTime createdAt;

    //@PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

