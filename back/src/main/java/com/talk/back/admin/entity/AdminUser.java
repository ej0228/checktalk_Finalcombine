// 1. AdminUser.java (Entity)

package com.talk.back.admin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // 관리자 로그인 ID

    @Column(nullable = false)
    private String password; // BCrypt로 암호화된 비밀번호

    @Column(nullable = false)
    private String role; // 예: "ADMIN"



}//class AdminUser

