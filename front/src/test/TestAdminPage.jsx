// ✅ [5] TestAdminPage.jsx
//import AdminDashboard from "@/pages/admin/AdminDashboard";
//import AdminUsers from "@/pages/admin/AdminUsers";
// import AdminAnalysis from "@/pages/admin/AdminAnalysis";
import AdminStats from "@/pages/admin/AdminStats";

export default function TestAdminPage() {
  return (
    <div className="p-6">
      {/* TODO: 테스트할 컴포넌트를 아래에서 선택적으로 변경 */}
      {/* <AdminDashboard /> */}
      {/* <AdminUsers /> */}
      {/* <AdminAnalysis /> */}
      <AdminStats />
    </div>
  );
}

//http://localhost:5173/admin-test => 테스트 확인 주소
// AdminStats 구현 : 터미널에서 설치 => npm install recharts
