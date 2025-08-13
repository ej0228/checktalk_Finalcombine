import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import API from "./api/axios";
import { ToastContainer } from "react-toastify";

// 🧩 공통 레이아웃
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// 🗂️ 인증
import LoginPage from "@/pages/auth/LoginPage";
import SignupForm from "@/pages/auth/SignupForm";
import MyPage from "@/pages/auth/MyPage";

// 📖 프로그램 정보
import IntroducePage from "@/pages/introduce/IntroducePage";

// 💬 커뮤니티
import CommunityBoard from "@/pages/community/CommunityBoard";

// 📚 라이브러리
import LibraryListPage from "@/pages/library/LibraryListPage";
import LibraryDetailPage from "@/pages/library/LibraryDetailPage";
import LibraryHiddenList from "@/pages/library/LibraryHiddenList";

// 📬 고객센터 (QnA)
import CustomerSupportBoard from "@/pages/qna/CustomerSupportBoard";
import CustomerSupportWrite from "@/pages/qna/CustomerSupportWrite";
import CustomerSupportDetail from "@/pages/qna/CustomerSupportDetail";
import UserNoticeDetail from "@/pages/qna/UserNoticeDetail";

// 🧠 기능 분석
import UnifiedChatAnalyzer from "@/pages/main/UnifiedChatAnalyzer";
import MatchingResultPage from "@/pages/main/MatchingResultPage";

// 🔐 인증 보호
import PrivateRoute from "@/components/auth/PrivateRoute";

// 관리자 로그인 페이지
import AdminLogin from "@/pages/admin/AdminLogin";

// 관리자 전용 라우트 묶음
import { adminRoutes } from "@/routes/AdminRoute";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setTimeout(() => {
        API.get("/users/mypage").catch(() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        });
      }, 500);
    }
  }, []);

  // 현재 경로가 '/admin'으로 시작하는지 확인 (React Router 방식)
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 관리자 페이지가 아닐 때만 사용자용 Header 표시 */}
      {!isAdminPage && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* ✅ 사용자 페이지 라우팅 */}
          <Route path="/" element={<UnifiedChatAnalyzer />} />
          <Route path="/comm" element={<CommunityBoard />} />
          <Route path="/qna" element={<CustomerSupportBoard />} />
          <Route path="/qna/write" element={<CustomerSupportWrite />} />
          <Route path="/qna/detail/:id" element={<CustomerSupportDetail />} />
          <Route path="/support/notices/:id" element={<UserNoticeDetail />} />
          <Route path="/intro" element={<IntroducePage />} />
          <Route path="/libD" element={<LibraryDetailPage />} />
          <Route path="/library/detail/:id" element={<LibraryDetailPage />} />
          <Route path="/lib" element={<LibraryListPage />} />
          <Route path="/libH" element={<LibraryHiddenList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/funcR" element={<MatchingResultPage />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/func" element={<UnifiedChatAnalyzer />} />

          {/* ✅ 관리자 로그인 페이지 */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ✅ 관리자 전용 보호 라우트들 */}
          {adminRoutes}
        </Routes>
      </main>

      {/* Footer는 항상 표시 */}
      <Footer />

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
