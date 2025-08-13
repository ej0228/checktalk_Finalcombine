import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mark from "@/assets/mark.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    console.log("[Header] toggleMenu 호출됨, 현재 상태:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  // 윈도우 리사이즈 시 메뉴 닫기 & 초기 localStorage 읽기
  useEffect(() => {
    console.log("[Header] 첫 번째 useEffect 실행 (리사이즈 + 초기 로드)");
    const stored = localStorage.getItem("user");
    console.log("[Header] 첫 번째 useEffect: stored =", stored);

    if (typeof stored === "string") {
      try {
        const parsed = JSON.parse(stored);
        console.log("[Header] 첫 번째 useEffect: parsed =", parsed);
        if (parsed && typeof parsed === "object") {
          setUser(parsed);
          console.log("[Header] 첫 번째 useEffect: setUser 완료");
        }
      } catch (e) {
        console.error("[Header] JSON 파싱 오류:", e);
      }
    }
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    const readUserFromStorage = () => {
      const stored = localStorage.getItem("user");
      console.log("[Header] readUserFromStorage 호출됨, stored =", stored);
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch (e) {
        console.error("[Header] JSON 파싱 오류:", e);
        setUser(null);
      }
    };

    // 같은 탭 갱신 이벤트
    const onAuthChanged = (e) => {
      console.log("[Header] 'auth-changed' 이벤트 수신:", e);
      readUserFromStorage();
    };

    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    console.log("[Header] handleLogout 호출됨");
    localStorage.removeItem("user");
    console.log("[Header] localStorage에서 user 제거 완료");
    setUser(null);
    console.log("[Header] setUser(null) 완료");
    alert("로그아웃 되었습니다.");
    window.location.reload(); // 새로고침으로 헤더 반영
  };

  const menuItems = [
    { label: "이해도분석", path: "/func" },
    { label: "소통스토리", path: "/intro" },
    { label: "라이브러리", path: "/lib" },
    { label: "커뮤니티", path: "/comm" },
    { label: "고객센터", path: "/qna" },
  ];

  return (
    <div className="w-full">
      {/* 상단 바 */}
      <div className="bg-gray-800 text-white py-2 text-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-5">
          <div className="text-gray-400">무슨말인지 궁금해? 체크해봐 쳌톡!</div>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-gray-300">
                  {user.name}님{" "}
                  <span className="text-blue-300">환영합니다!</span>
                </span>
                <Link to="/mypage" className="hover:underline text-gray-300">
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:underline text-gray-300"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="hover:underline text-gray-300">
                  회원가입
                </Link>
                <Link to="/login" className="hover:underline text-gray-300">
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <header className="bg-white border-b border-gray-200 relative">
        <div className="py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-5">
            {/* 로고 + 텍스트 묶음 */}
            <div className="flex items-center space-x-2">
              {" "}
              {/* 간격 조절: space-x-2 = 0.5rem */}
              <img
                src={mark}
                alt="쳌톡 마크"
                className="w-10 h-10 object-contain"
              />
              <Link
                to="/"
                className="text-2xl font-bold text-gray-800 no-underline"
              >
                쳌톡
              </Link>
            </div>

            {/* 데스크탑 메뉴 */}
            <nav className="hidden md:block">
              <ul className="flex gap-10">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-gray-800 font-medium hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 모바일 햄버거 */}
            <button onClick={toggleMenu} className="md:hidden p-1">
              <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 transition-all z-50 ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 invisible"
          }`}
        >
          <ul className="p-5">
            {menuItems.map((item) => (
              <li key={item.label} className="border-b">
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-4 text-gray-800 font-medium hover:text-blue-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
