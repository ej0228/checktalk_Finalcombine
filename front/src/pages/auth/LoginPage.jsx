import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ResetPasswordVerifyModal from "@/components/auth/ResetPasswordVerifyModal";

const API = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔥 handleSubmit triggered!!!");
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      console.log("[Login] 요청 시작:", `${API}/users/login`, { email });
      const res = await axios.post(
        `${API}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("[Login] 응답 수신:", res.status, res.data);

      if (res.status === 200 && res.data.userId) {
        const user = {
          userId: res.data.userId,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        };

        console.log("[Login] setItem 직전, user =", user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("[Login] setItem 완료");

        // 같은 탭 헤더 갱신: 동기적으로 즉시 리스너 호출
        const evt = new CustomEvent("auth-changed", { detail: { source: "login", user } });
        console.log("[Login] dispatchEvent 직전:", evt);
        window.dispatchEvent(evt);
        console.log("[Login] dispatchEvent 완료");

        // UI 메시지 (await하지 않음)
        toast.success(`${user.name}님 환영합니다`);

        // 마지막에 이동
        console.log("[Login] navigate 직전:", from);
        navigate(from, { replace: true });
        return;
      }

      console.error("[Login] 로그인 실패 응답:", res.data);
      toast.error(res.data?.message || "로그인에 실패했습니다.");
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;

      console.error("[Login] 오류!", {
        url: `${API}/users/login`,
        status,
        message: msg,
        full: error,
      });

      if (status === 401) alert("비밀번호가 틀렸습니다. 다시 입력해주세요.");
      else if (status === 404) alert("등록되지 않은 이메일입니다. 회원가입을 해주세요.");
      else if (status === 410) alert("탈퇴한 계정입니다. 다시 가입해주세요.");
      else if (status === 423) alert("정지된 계정입니다. 고객센터에 문의해주세요.");
      else if (status === 428) alert("휴면 계정입니다. 이메일 인증 후 로그인해주세요.");
      else alert(msg || "로그인 중 문제가 발생했습니다. 다시 로그인 해주세요");
    } finally {
      console.log("[Login] 요청 종료, loading=false");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            로그인
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                사용자 아이디
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="이메일을 입력해주세요"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 px-4 rounded-md text-white text-sm font-medium transition duration-200 ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>

          {/* 비밀번호 재설정 & 회원가입 */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-gray-600 hover:text-blue-600 hover:underline"
            >
              비밀번호 재설정
            </button>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-gray-600 hover:text-blue-600 hover:underline"
            >
              회원가입
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="text-slate-300 hover:text-slate-700 transition duration-200 underline-offset-4 hover:underline"
            >
              관리자모드
            </button>

          </div>
        </form>

        {/* 비밀번호 재설정 모달 */}
        {showResetModal && (
          <ResetPasswordVerifyModal onClose={() => setShowResetModal(false)} />
        )}
      </div>
    </div>
  );
}
