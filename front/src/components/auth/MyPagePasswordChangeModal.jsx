import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyPagePasswordChangeModal({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");

    // 새 비밀번호 일치 검사
    if (name === "newPassword" || name === "newPasswordConfirm") {
      const np = name === "newPassword" ? value : form.newPassword;
      const npc = name === "newPasswordConfirm" ? value : form.newPasswordConfirm;

      if (np && npc) {
        if (np === npc) {
          setPasswordError("새 비밀번호가 일치합니다!");
        } else {
          setPasswordError("새 비밀번호가 일치하지 않습니다!");
        }
      } else {
        setPasswordError(""); // 둘 중 하나라도 비어 있으면 메시지 제거
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
      return;
    }

    const confirm = window.confirm("정말 수정하시겠습니까?");
    if (!confirm) {
      alert("비밀번호 수정이 취소되었습니다");
      onClose();
      return;
    }

    try {
      const res = await axios.post(
        `${API}/users/password/change`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          newPasswordConfirm: form.newPasswordConfirm,
        },
        { withCredentials: true }
      );
      alert(res.data || "비밀번호가 성공적으로 수정되었습니다");
      onClose();
    } catch (err) {
      alert(err.response?.data || "비밀번호 수정에 실패했습니다");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          비밀번호 수정
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 items-center">
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호"
              className="flex-1 rounded-lg border bg-gray-50 border-gray-300 p-3 text-gray-900"
              disabled={isCurrentPasswordValid} // 확인되면 수정 못하게
            />
            <button
              type="button"
              onClick={verifyCurrentPassword}
              disabled={checking || isCurrentPasswordValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {checking ? "확인 중..." : isCurrentPasswordValid ? "확인됨" : "확인"}
            </button>
          </div>

          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="새 비밀번호"
            className="w-full rounded-lg border bg-gray-50 border-gray-300 p-3 text-gray-900"
            disabled={!isCurrentPasswordValid}
          />
          <input
            type="password"
            name="newPasswordConfirm"
            value={form.newPasswordConfirm}
            onChange={handleChange}
            placeholder="새 비밀번호 확인"
            className="w-full rounded-lg border bg-gray-50 border-gray-300 p-3 text-gray-900"
            disabled={!isCurrentPasswordValid}
          />
          {passwordError && (
            <p
              className={`text-sm -mt-3 mb-1 pl-1 ${passwordError.includes("일치합니다") ? "text-green-600" : "text-red-500"
                }`}
            >
              {passwordError}
            </p>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isCurrentPasswordValid}
              className="w-1/2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-50"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
