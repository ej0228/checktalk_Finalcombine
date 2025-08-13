package com.talk.back.community.repository;

import com.talk.back.auth.entity.User;
import com.talk.back.community.entity.Comment;
import com.talk.back.community.entity.CommentReport;
import com.talk.back.community.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CommentReportRepository extends JpaRepository<CommentReport, Long> {

    Optional<CommentReport> findByUserAndComment(User user, Comment comment);

    boolean existsByUserAndCommentAndCanceledFalse(User user, Comment comment);

    int countByCommentAndCanceledFalse(Comment comment);

    @Query("SELECT COUNT(cr) FROM CommentReport cr WHERE cr.comment.reportStatus = 'PENDING'")
    long countPendingReports();

}
