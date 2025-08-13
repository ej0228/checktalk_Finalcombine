import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PasswordChangeModal({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordErrorColor, setPasswordErrorColor] = useState("red");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");

    // 새 비밀번호 일치 확인
    if (name === "newPasswordConfirm" || name === "newPassword") {
      const newPassword = name === "newPassword" ? value : form.newPassword;
      const confirmPassword = name === "newPasswordConfirm" ? value : form.newPasswordConfirm;

      if (newPassword && confirmPassword) {
        if (newPassword === confirmPassword) {
          setPasswordError("새 비밀번호가 일치합니다");
          setPasswordErrorColor("green");
        } else {
          setPasswordError("새 비밀번호가 일치하지 않습니다");
          setPasswordErrorColor("red");
        }
      }
    }
  };

  // 현재 비밀번호 확인 함수 (버튼 클릭 시 실행)
  const verifyCurrentPassword = async () => {
    if (!form.currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    setChecking(true);
    try {
      const res = await axios.post(
        `${API}/users/password/verify`,
        { currentPassword: form.currentPassword },
        { withCredentials: true }
      );
      if (res.data.valid) {
        alert("현재 비밀번호가 확인되었습니다");
        setIsCurrentPasswordValid(true);
        setPasswordError("");
      } else {
        alert("현재 비밀번호가 일치하지 않습니다");
        setIsCurrentPasswordValid(false);
      }
    } catch (err) {
      alert("비밀번호 확인 중 오류가 발생했습니다.");
      setIsCurrentPasswordValid(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCurrentPasswordValid) {
      alert("현재 비밀번호 확인을 먼저 해주세요!");
      return;
    }
    if (!form.newPassword || !form.newPasswordConfirm) {
      alert("새 비밀번호를 모두 입력해주세요!");
      return;
    }
    if (form.newPassword !== form.newPasswordConfirm) {
      setPasswordError("새 비밀번호가 일치하지 않습니다!");
      setPasswordErrorColor("red");
      return;
    }

    const confirm = window.confirm("정말 수정하시겠습니까?");
    if (!confirm) {
      alert("비밀번호 수정이 취소되었습니다");
      onClose();
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${API}/users/password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          newPasswordConfirm: form.newPasswordConfirm,
        },
        { withCredentials: true }
      );
      alert("비밀번호가 성공적으로 수정되었습니다");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "비밀번호 수정에 실패했습니다";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          비밀번호 수정
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 현재 비밀번호 섹션 */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호"
                className={`flex-1 px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isCurrentPasswordValid
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }`}
                disabled={isCurrentPasswordValid}
              />
              <button
                type="button"
                onClick={verifyCurrentPassword}
                disabled={checking || isCurrentPasswordValid}
                className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[0.98] active:scale-95 ${checking || isCurrentPasswordValid
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : isCurrentPasswordValid
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                  }`}
              >
                {checking ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    확인중
                  </div>
                ) : isCurrentPasswordValid ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    확인됨
                  </div>
                ) : (
                  "확인"
                )}
              </button>
            </div>

            {isCurrentPasswordValid && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-green-700">현재 비밀번호가 확인되었습니다</span>
              </div>
            )}
          </div>

          {/* 새 비밀번호 섹션 */}
          <div className="space-y-4">
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호"
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${!isCurrentPasswordValid
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 hover:border-gray-300"
                }`}
              disabled={!isCurrentPasswordValid}
            />

            <input
              type="password"
              name="newPasswordConfirm"
              value={form.newPasswordConfirm}
              onChange={handleChange}
              placeholder="새 비밀번호 확인"
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${!isCurrentPasswordValid
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 hover:border-gray-300"
                }`}
              disabled={!isCurrentPasswordValid}
            />

            {passwordError && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${passwordErrorColor === "green"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
                }`}>
                {passwordErrorColor === "green" ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className={`text-sm font-medium ${passwordErrorColor === "green" ? "text-green-700" : "text-red-700"
                  }`}>
                  {passwordError}
                </span>
              </div>
            )}
          </div>

          {/* 버튼 섹션 */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={loading || !isCurrentPasswordValid}
              className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 transform ${loading || !isCurrentPasswordValid
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:scale-[0.98] active:scale-95"
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  수정 중...
                </div>
              ) : (
                "비밀번호 수정하기"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold border border-gray-200 transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}