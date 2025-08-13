package com.talk.back.auth.controller;

import jakarta.validation.Valid;
import com.talk.back.auth.dto.EmailCodeRequestDto;
import com.talk.back.auth.dto.EmailCodeVerifyDto;
import com.talk.back.auth.service.EmailVerificationService;
import com.talk.back.auth.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 이메일 인증 요청 및 검증을 처리하는 컨트롤러
 *
 * [엔드포인트]
 * - POST /email/send : 인증 코드 이메일 전송
 * - POST /email/verify : 인증 코드 검증
 */
@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;
    private final MailService mailService;

    /**
     * 이메일로 인증 코드 전송
     *
     * @param dto 이메일 주소 + 인증 목적
     * @return 200 OK 응답
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendVerificationCode(@RequestBody @Valid EmailCodeRequestDto dto) {
        String code = emailVerificationService.generateAndSaveVerificationCode(dto.getEmail(), dto.getPurpose());
        mailService.sendVerificationCode(dto.getEmail(), code, dto.getPurpose());
        return ResponseEntity.ok("인증 코드가 이메일로 발송되었습니다.");
    }

    /**
     * 인증 코드 검증 요청
     *
     * @param dto 이메일 + 인증 코드 + 목적
     * @return 인증 성공 여부 메시지
     */
    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(@RequestBody @Valid EmailCodeVerifyDto dto) {
        boolean success = emailVerificationService.verifyCode(dto.getEmail(), dto.getCode(), dto.getPurpose());
        if (success) {
            // 여기서 별도 markAsVerified 호출 필요 없음
            return ResponseEntity.ok("인증이 성공적으로 완료되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("인증에 실패했습니다. 코드가 틀리거나 만료되었습니다.");
        }
    }

}
