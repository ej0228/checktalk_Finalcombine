package com.talk.back.community.entity;

import jakarta.persistence.*;
import com.talk.back.auth.entity.User;
import lombok.*;

@Entity
@Table(name = "comment_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "comment_id"}) //중복 방지
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentLike {

    @Id @GeneratedValue
    private Long id;

    /**
     * 좋아요 누른 사용자
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 좋아요 대상 댓글
     */
    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;

    public CommentLike(User user, Comment comment) {
        this.user = user;
        this.comment = comment;
    }
}