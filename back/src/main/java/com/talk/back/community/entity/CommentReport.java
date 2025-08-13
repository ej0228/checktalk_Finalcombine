package com.talk.back.community.entity;

import jakarta.persistence.*;
import com.talk.back.auth.entity.User;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 누가
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // 어떤 댓글을
    @ManyToOne(fetch = FetchType.LAZY)
    private Comment comment;

    private String reason; // 신고 사유

    private boolean canceled; // 신고 취소 여부
}
