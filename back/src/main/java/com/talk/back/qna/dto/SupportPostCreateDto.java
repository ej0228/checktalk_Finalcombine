package com.talk.back.qna.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class SupportPostCreateDto {
    @NotBlank(message = "문의 유형은 필수입니다.")
    private String type; // 예: "inquiry"

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    // UI 용도
    private boolean isNewPost = true;
    private int colorIndex = 0;

    private MultipartFile[] files;

    // 사용자 정보 추가 (프론트에서 전달받음)
    @NotBlank(message = "이름을 입력해주세요.")
    private String name;

    @Email(message = "유효한 이메일 형식을 입력해주세요.")
    @NotBlank(message = "이메일은 필수입니다.")
    private String email;

    @NotBlank(message = "전화번호는 필수입니다.")
    private String phone;

}
