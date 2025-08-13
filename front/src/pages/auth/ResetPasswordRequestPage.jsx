import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ResetPasswordRequestPage() {
  const navigate = useNavigate();

  // 1) 가입된 이메일(계정 소유 확인용)
  const [accountEmail, setAccountEmail] = useState("");
  const [accountEmailVerified, setAccountEmailVerified] = useState(false);

  // 2) 재설정 코드를 받을 이메일(보통 가입 메일과 동일하게 사용)
  const [receiveEmail, setReceiveEmail] = useState("");
  const [receiveEmailVerified, setReceiveEmailVerified] = useState(false);

  // 3) 이메일 코드
  const [verificationCode, setVerificationCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  // 4) 새 비밀번호
  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ 1) 가입된 이메일 확인
  const checkAccountEmail = async () => {
    if (!accountEmail) return alert("가입된 이메일을 입력해주세요.");
    try {
      const res = await axios.get(`${API}/users/check-email`, {
        params: { email: accountEmail },
      });
      if (res.data?.exists === true) {
        alert("가입된 이메일이 확인되었습니다!");
        setAccountEmailVerified(true);
      } else {
        alert("해당 이메일은 가입되어 있지 않습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  // ✅ 2) 수신 이메일 형식 확인
  const checkReceiveEmail = () => {
    if (!receiveEmail || !receiveEmail.includes("@")) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    alert("수신 이메일 형식이 올바릅니다!");
    setReceiveEmailVerified(true);
  };

  // ✅ 2-1) 코드 발송 (purpose: RESET)
  const sendResetCode = async () => {
    if (!accountEmailVerified)
      return alert("가입된 이메일 확인부터 진행해주세요.");
    if (!receiveEmailVerified)
      return alert("수신 이메일 확인부터 진행해주세요.");
    try {
      await axios.post(`${API}/email/send`, {
        email: receiveEmail,
        purpose: "PASSWORD_RESET",
      });
      alert("재설정용 인증코드를 발송했습니다. 메일함을 확인하세요!");
    } catch (e) {
      console.error(e);
      alert("인증코드 발송에 실패했습니다.");
    }
  };

  // ✅ 3) 코드 검증
  const verifyCode = async () => {
    if (!verificationCode) return alert("인증코드를 입력해주세요.");
    try {
      await axios.post(`${API}/email/verify`, {
        email: receiveEmail,
        code: verificationCode,
        purpose: "PASSWORD_RESET",
      });
      alert("인증코드가 확인되었습니다.");
      setCodeVerified(true);
    } catch (e) {
      console.error(e);
      alert("인증코드가 일치하지 않거나 만료되었습니다.");
    }
  };

  // ✅ 4) 비밀번호 재설정 (A 방식 최종 단계)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!codeVerified) return alert("이메일 인증코드를 먼저 확인해주세요.");
    if (!newPwd || !newPwd2) return alert("새 비밀번호를 모두 입력해주세요.");
    if (newPwd !== newPwd2) return alert("새 비밀번호가 서로 다릅니다.");
    if (newPwd.length < 4)
      return alert("새 비밀번호는 최소 4자 이상이어야 합니다.");

    setLoading(true);
    try {
      // ⚠️ PasswordResetChangeDto 구조에 맞춰 필드명 조정하세요.
      // 일반적으로 email, code(검증 증빙), newPassword 를 포함시키는 걸 권장합니다.
      await axios.post(`${API}/users/password/reset`, {
        email: accountEmail, // 서버 기준으로 email을 무엇으로 볼지(가입 메일/수신 메일) 통일
        newPassword: newPwd,
        newPasswordConfirm: newPwd2,
      });

      alert("비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해주세요.");
      navigate("/login");
    } catch (e) {
      console.error(e);
      alert(e.response?.data || "비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-xl shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          비밀번호 재설정 ✉️
        </h2>

        {/* 1) 가입 이메일 확인 */}
        <section className="space-y-3">
          <p className="font-semibold">1) 가입된 이메일 확인</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={accountEmail}
              onChange={(e) => {
                setAccountEmail(e.target.value);
                setAccountEmailVerified(false);
              }}
              placeholder="가입된 이메일"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
              required
            />
            <button
              type="button"
              onClick={checkAccountEmail}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
          {accountEmailVerified && (
            <p className="text-sm text-green-600">가입 이메일 확인 완료</p>
          )}
        </section>

        {/* 2) 수신 이메일 + 코드 발송 */}
        <section className="space-y-3">
          <p className="font-semibold">2) 재설정 코드 받을 이메일</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={receiveEmail}
              onChange={(e) => {
                setReceiveEmail(e.target.value);
                setReceiveEmailVerified(false);
              }}
              placeholder="수신 이메일"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
              required
            />
            <button
              type="button"
              onClick={checkReceiveEmail}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>

          <button
            type="button"
            disabled={!accountEmailVerified || !receiveEmailVerified}
            onClick={sendResetCode}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              !accountEmailVerified || !receiveEmailVerified
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            인증코드 발송
          </button>
        </section>

        {/* 3) 코드 검증 */}
        <section className="space-y-3">
          <p className="font-semibold">3) 이메일 인증코드 입력</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증코드"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            />
            <button
              type="button"
              onClick={verifyCode}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
          {codeVerified && (
            <p className="text-sm text-green-600">코드 검증 완료</p>
          )}
        </section>

        {/* 4) 새 비밀번호 설정 */}
        <form onSubmit={handleResetPassword} className="space-y-3">
          <p className="font-semibold">4) 새 비밀번호 설정</p>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="새 비밀번호"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
          <input
            type="password"
            value={newPwd2}
            onChange={(e) => setNewPwd2(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
          <button
            type="submit"
            disabled={!codeVerified || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              !codeVerified || loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "처리 중..." : "비밀번호 재설정 완료"}
          </button>
        </form>
      </div>
    </div>
  );
}
