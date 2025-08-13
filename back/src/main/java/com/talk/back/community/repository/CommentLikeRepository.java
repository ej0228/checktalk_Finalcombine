package com.talk.back.community.repository;

import com.talk.back.auth.entity.User;
import com.talk.back.community.entity.CommentLike;
import com.talk.back.community.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    Optional<CommentLike> findByUserAndComment(User user, Comment comment);
    boolean existsByUserAndComment(User user, Comment comment);
    long countByComment(Comment comment);
}