import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ResetPasswordVerifyModal({ onClose }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [step, setStep] = useState("send"); // send → verify → reset
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const checkEmailExists = async (email) => {
    const res = await axios.get(`${API}/users/check-email`, {
      params: { email },
    });
    return res.data.exists;
  };

  const sendCode = async () => {
    if (!email.includes("@")) return alert("올바른 이메일을 입력해주세요.");

    setLoading(true);
    try {
      const exists = await checkEmailExists(email);
      if (!exists) return alert("가입되지 않은 이메일입니다.");

      await axios.post(`${API}/users/verify/send`, {
        email,
        purpose: "PASSWORD_RESET",
      });

      alert("인증코드가 이메일로 전송되었습니다.");
      setStep("verify");
    } catch (err) {
      alert(err.response?.data?.message || "코드 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) return alert("인증코드를 입력해주세요.");

    setLoading(true);
    try {
      await axios.post(`${API}/users/verify/confirm`, {
        email,
        code,
        purpose: "PASSWORD_RESET",
      });

      alert("인증이 완료되었습니다.");
      setStep("reset");
    } catch (err) {
      alert(err.response?.data?.message || "인증 실패");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "newPasswordConfirm") setNewPasswordConfirm(value);

    if (
      (name === "newPassword" && value === newPasswordConfirm) ||
      (name === "newPasswordConfirm" && value === newPassword)
    ) {
      setPasswordMessage("비밀번호가 일치합니다.");
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");

    setLoading(true);
    try {
      await axios.post(`${API}/users/password/reset`, {
        email,
        newPassword,
        newPasswordConfirm,
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      onClose();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "비밀번호 변경 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border-2 border-gray-100 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
          비밀번호 재설정
        </h3>

        {/* STEP 1: 이메일 */}
        {step === "send" && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="가입된 이메일"
              className="w-full border-2 border-gray-300 bg-gray-50 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            />
            <div className="flex gap-2 pt-3">
              <button
                onClick={async () => {
                  if (!email.includes("@")) return alert("이메일을 입력해주세요.");
                  setLoading(true);
                  try {
                    const exists = await checkEmailExists(email);
                    alert(exists ? "가입된 이메일입니다." : "가입되지 않은 이메일입니다.");
                  } catch {
                    alert("이메일 확인 실패");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-1/2 py-3 rounded-xl border-2 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-[0.98]"
              >
                이메일 확인
              </button>
              <button
                onClick={sendCode}
                disabled={loading}
                className="w-1/2 py-3 rounded-xl border-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-md hover:scale-[0.98] transition-all duration-200 focus:ring-2 focus:ring-blue-400"
              >
                {loading ? "전송 중..." : "인증코드 전송"}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: 인증코드 */}
        {step === "verify" && (
          <>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증코드 입력"
              className="w-full border-2 border-gray-300 bg-gray-50 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            />
            <div className="flex gap-2 pt-3">
              <button
                onClick={onClose}
                className="w-1/2 py-3 rounded-xl border-2 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-[0.98]"
              >
                취소
              </button>
              <button
                onClick={verifyCode}
                disabled={loading}
                className="w-1/2 py-3 rounded-xl border-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-md hover:scale-[0.98] transition-all duration-200 focus:ring-2 focus:ring-green-400"
              >
                {loading ? "확인 중..." : "확인"}
              </button>
            </div>
          </>
        )}

        {/* STEP 3: 비밀번호 재설정 */}
        {step === "reset" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="새 비밀번호"
              className="w-full border-2 border-gray-300 bg-gray-50 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              required
            />
            <input
              type="password"
              name="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={handlePasswordChange}
              placeholder="새 비밀번호 확인"
              className="w-full border-2 border-gray-300 bg-gray-50 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
              required
            />
            {passwordMessage && (
              <p className={`text-sm pl-1 ${passwordMessage.includes("일치합니다") ? "text-green-600" : "text-red-500"}`}>
                {passwordMessage}
              </p>
            )}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3 rounded-xl border-2 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-[0.98]"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 rounded-xl border-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-md hover:scale-[0.98] transition-all duration-200 focus:ring-2 focus:ring-blue-400"
              >
                비밀번호 재설정
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
