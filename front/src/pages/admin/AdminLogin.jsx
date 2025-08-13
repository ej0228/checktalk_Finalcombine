import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/admin/login", {
        username,
        password,
      });

      console.log("서버 응답:", response.data);

      if (
        response.data.username &&
        response.data.role?.toUpperCase() === "ADMIN"
      ) {
        localStorage.setItem("role", "ADMIN"); // 권한 저장
        alert("관리자 로그인 성공");
        navigate("/admin"); // 관리자 대시보드로 이동
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("관리자 로그인 오류:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "서버와의 통신 중 문제가 발생했습니다.";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">관리자 로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="관리자 ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
