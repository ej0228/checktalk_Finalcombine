import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserForm from "@/components/auth/UserForm";

const API = import.meta.env.VITE_API_BASE_URL;

/**
 * 회원가입 폼 컨테이너 컴포넌트
 * - 사용자 정보 입력을 받아 백엔드에 회원가입 요청을 보냄
 * - 이메일 중복 확인 및 이메일 인증 코드 전송/확인 로직 포함
 */
export default function SignupForm() {
  const navigate = useNavigate();

  /**
   * 사용자 입력 값 상태
   */
  const [form, setForm] = useState({
    name: "",
    email: "", // 이메일 (로그인 ID로 사용, 수신 이메일과 동일)
    password: "",
    passwordConfirm: "",
    phone: "",
    birthDate: "",
    gender: "",
    job: "",
    interest: "",
    usagePurpose: "",
    communicationGoal: "",
  });

  /**
   * 비밀번호 일치 여부 상태
   */
  const [passwordError, setPasswordError] = useState("");
  const [passwordErrorColor, setPasswordErrorColor] = useState("");

  /**
   * 기타 상태들
   */
  const [loading, setLoading] = useState(false); // 전송 중 여부
  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복확인 여부
  const [receiveEmailVerified, setReceiveEmailVerified] = useState(false); // 이메일 인증 완료 여부
  const [verificationCode, setVerificationCode] = useState(""); // 입력한 인증 코드

  /**
   * 모든 input 값 변경 핸들러
   * - 비밀번호 일치 여부도 동시 확인
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // 비밀번호 일치 확인
    if (name === "password" || name === "passwordConfirm") {
      const newPassword = name === "password" ? value : form.password;
      const newConfirm =
        name === "passwordConfirm" ? value : form.passwordConfirm;

      if (newPassword && newConfirm) {
        if (newPassword === newConfirm) {
          setPasswordError("비밀번호가 일치합니다.");
          setPasswordErrorColor("green");
        } else {
          setPasswordError("비밀번호가 일치하지 않습니다.");
          setPasswordErrorColor("red");
        }
      } else {
        setPasswordError("");
        setPasswordErrorColor("");
      }
    }
  };

  /**
   * 이메일 중복 확인 요청
   */
  const checkEmailDuplicate = async () => {
    if (!form.email) {
      alert("이메일을 먼저 입력해주세요.");
      return;
    }
    try {
      const res = await axios.get(
        `${API}/users/check-email?email=${form.email}`
      );
      if (res.data.exists) {
        alert("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      }
    } catch (err) {
      console.error(err);
      alert("이메일 중복 확인 중 오류가 발생했어요.");
    }
  };

  /**
   * 이메일 인증 코드 전송
   */
  const handleSendVerificationCode = async () => {
    if (!form.email) return alert("인증 받을 이메일을 입력해주세요.");

    try {
      await axios.post(`${API}/email/send`, {
        email: form.email, // 입력한 이메일로 코드 발송
        purpose: "SIGNUP", // VerificationPurpose Enum 기준
      });
      alert("인증코드가 발송되었습니다!");
    } catch (err) {
      console.error(err);
      alert("인증코드 발송에 실패했습니다.");
    }
  };

  /**
   * 인증 코드 확인
   */
  const handleVerifyCode = async () => {
    if (!form.email || !verificationCode) {
      alert("이메일과 인증코드를 모두 입력해주세요.");
      return;
    }

    try {
      await axios.post(`${API}/email/verify`, {
        email: form.email,
        code: verificationCode,
        purpose: "SIGNUP",
      });
      alert("이메일 인증이 완료되었습니다.");
      setReceiveEmailVerified(true);
    } catch (err) {
      console.error(err);
      alert("인증코드가 일치하지 않거나 만료되었습니다.");
    }
  };

  /**
   * 최종 회원가입 제출 처리
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // 프론트엔드 유효성 검증
    if (!form.name) return alert("이름을 입력해주세요."), setLoading(false);
    if (!form.email) return alert("이메일을 입력해주세요."), setLoading(false);
    if (!emailChecked)
      return alert("이메일 중복 확인을 해주세요."), setLoading(false);
    if (!receiveEmailVerified)
      return alert("수신 이메일 인증을 완료해주세요!"), setLoading(false);
    if (!form.password || !form.passwordConfirm)
      return alert("비밀번호를 입력해주세요."), setLoading(false);
    if (form.password.length < 4)
      return alert("비밀번호는 최소 4자 이상이어야 합니다!"), setLoading(false);
    if (form.password !== form.passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다."), setLoading(false);
    if (!form.phone)
      return alert("전화번호를 입력해주세요."), setLoading(false);
    if (!form.birthDate)
      return alert("생년월일을 선택해주세요."), setLoading(false);
    if (!form.gender) return alert("성별을 선택해주세요."), setLoading(false);

    try {
      const payload = { ...form };
      delete payload.passwordConfirm;

      // 선택 항목 비어 있으면 null 처리
      payload.job = payload.job || null;
      payload.interest = payload.interest || null;
      payload.usagePurpose = payload.usagePurpose || null;
      payload.communicationGoal = payload.communicationGoal?.trim() || null;

      // 생년월일 ISO 포맷으로 변환
      payload.birthDate = new Date(form.birthDate).toISOString().slice(0, 10);

      // 회원가입 요청
      const res = await axios.post(`${API}/users/signup`, payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert(res.data || "알 수 없는 응답입니다.");
      }
    } catch (err) {
      console.error("회원가입 중 오류:", err);
      alert(err.response?.data || "서버 오류가 발생했습니다!");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 실제 렌더링
   */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm max-w-md w-full px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          회원가입
        </h2>
        <UserForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          isEdit={false}
          onEmailCheck={checkEmailDuplicate}
          passwordError={passwordError}
          passwordErrorColor={passwordErrorColor}
          onSendVerificationCode={handleSendVerificationCode}
          onVerifyCode={handleVerifyCode}
          verificationCode={verificationCode}
          onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
          receiveEmailVerified={receiveEmailVerified}
          setReceiveEmailVerified={setReceiveEmailVerified}
        />
      </div>
    </div>
  );
}
