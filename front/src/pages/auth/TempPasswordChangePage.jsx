import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function TempPasswordChangePage() {
  const [form, setForm] = useState({
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🚨 임시비밀번호 로그인 확인
  useEffect(() => {
    const usingTemp = localStorage.getItem("usingTempPassword");
    if (usingTemp !== "true") {
      alert("임시 비밀번호로 로그인한 사용자만 접근 가능합니다.");
      navigate("/"); // 🚪 나가!
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.newPassword || !form.newPasswordConfirm) {
      alert("새 비밀번호를 모두 입력해주세요!");
      return;
    }

    if (form.newPassword !== form.newPasswordConfirm) {
      setError("새 비밀번호가 일치하지 않습니다!");
      return;
    }

    const confirm = window.confirm("정말 비밀번호를 변경하시겠습니까?");
    if (!confirm) return;

    try {
      await axios.put(
        `${API}/users/password`,
        {
          currentPassword: "TEMP", // 서버에서 임시 비밀번호 여부로 판단 처리함
          newPassword: form.newPassword,
          newPasswordConfirm: form.newPasswordConfirm,
        },
        { withCredentials: true }
      );

      alert("비밀번호가 성공적으로 변경되었습니다!");

      // ✅ 플래그 제거
      localStorage.removeItem("usingTempPassword");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "비밀번호 변경 실패 😢");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">비밀번호 변경 🔒</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="새 비밀번호"
            className="w-full border px-4 py-3 rounded-lg"
            required
          />
          <input
            type="password"
            name="newPasswordConfirm"
            value={form.newPasswordConfirm}
            onChange={handleChange}
            placeholder="새 비밀번호 확인"
            className="w-full border px-4 py-3 rounded-lg"
            required
          />
          {error && <p className="text-sm text-red-500 pl-1">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            비밀번호 변경하기
          </button>
        </form>
      </div>
    </div>
  );
}
