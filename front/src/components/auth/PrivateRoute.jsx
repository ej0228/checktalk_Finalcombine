import React from "react";
import { useLocation, Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // 로그인 안한 상태 → 로그인 페이지로 이동 (현재 위치 기억)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 로그인 O → children 그대로 보여줌
  return children;
}
