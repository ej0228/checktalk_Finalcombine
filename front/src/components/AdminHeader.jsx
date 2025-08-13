// src/components/AdminHeader.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 리사이즈 시 모바일 메뉴 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("role");
    alert("관리자 로그아웃 되었습니다.");
    window.location.href = "/";
  };

  const menuItems = [
    { label: "대시보드", path: "/admin" },
    { label: "회원관리", path: "/admin/users" },
    { label: "분석기록", path: "/admin/analysis" },
    { label: "커뮤니티", path: "/admin/community" },
    { label: "고객센터", path: "/admin/support" },
    { label: "관리자로그", path: "/admin/logs" },
    // { label: "사용자로그", path: "/admin/user-logs" }, // 임시 잠금
  ];

  return (
    <div className="w-full">
      {/* 상단 안내 바 (반전 강조) */}
      <div className="bg-white text-blue-800 py-2 text-xs border-b border-gray-300">
        <div className="w-full px-8 flex items-center justify-between">
          <div className="text-sm font-semibold">관리자 모드 활성화 중</div>
          {/* 👉 로그아웃 버튼 오른쪽으로 이동 */}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline font-medium"
          >
            로그아웃
          </button>
        </div>
      </div>

      <header className="bg-gray-800 text-white relative">
        <div className="py-4">
          <div className="w-full px-8 flex items-center justify-between">
            {/* 왼쪽: 관리자 모드 타이틀 */}
            <Link
              to="/admin"
              className="text-2xl font-bold text-yellow-300 no-underline"
            >
              관리자 모드
            </Link>

            {/* 오른쪽: 데스크탑 메뉴 */}
            <nav className="hidden md:block">
              <ul className="flex gap-8">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="font-medium hover:text-yellow-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 모바일 햄버거 버튼 */}
            <button onClick={toggleMenu} className="md:hidden p-1">
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 그대로 유지 */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-gray-900 text-white transition-all z-50 ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 invisible"
          }`}
        >
          <ul className="p-5">
            {menuItems.map((item) => (
              <li key={item.label} className="border-b border-gray-700">
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-4 font-medium hover:text-yellow-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* 모바일 전용 로그아웃 버튼은 남겨둠 */}
            <li className="pt-4">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left text-red-400 font-medium hover:underline"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default AdminHeader;
