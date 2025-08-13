import React from "react";
import { Navigate, Route } from "react-router-dom";

import AdminLayout from "@/routes/AdminLayout";

// ✅ 관리자 페이지 컴포넌트들
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAnalysis from "@/pages/admin/AdminAnalysis";
import AdminCommunity from "@/pages/admin/AdminCommunity";
import AdminSupport from "@/pages/admin/AdminSupport";
import AdminNoticeDetail from "@/pages/admin/AdminNoticeDetail";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminQnaDetail from "@/pages/admin/AdminQnaDetail";

// ✅ 새로 추가된 사용자 로그 페이지 : 임시잠금
//import AdminUserLog from "@/pages/admin/AdminUserLog";

// 1. 보호용 컴포넌트
export default function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children || null;
}

// 2. 관리자 페이지 라우팅 구성
export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    {/* AdminLayout의 <Outlet />을 통해 아래 자식 라우트가 보여짐 */}
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="analysis" element={<AdminAnalysis />} />
    <Route path="community" element={<AdminCommunity />} />
    <Route path="support" element={<AdminSupport />} />
    {/* ✅ 공지사항 등록 및 상세 라우팅 - 복수형으로 수정 */}
    <Route path="support/notices/new" element={<AdminNoticeDetail />} />
    <Route path="support/notices/:id" element={<AdminNoticeDetail />} />
    <Route path="logs" element={<AdminLogs />} />
    {/* <Route path="user-logs" element={<AdminUserLog />} />{" "} 임시잠금 */}
    {/* ✅ 사용자 로그인 로그 */}
    <Route path="qna/:id" element={<AdminQnaDetail />} />
  </Route>
);
