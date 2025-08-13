import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import API from "@/api/axios";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [pendingSupport, setPendingSupport] = useState(0);
  const [userTrend, setUserTrend] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    todayCount: 0,
    averageMatchingRate: 0,
  });
  const [monthlyAnalysisTrend, setMonthlyAnalysisTrend] = useState([]);

  useEffect(() => {
    API.get("/admin/stats/users")
      .then((res) => {
        const stats = res.data;
        setTotalUsers(stats.userCount);
        setPendingReports(stats.reportPendingCount);
        setPendingSupport(stats.supportPendingCount);
      })
      .catch((err) => console.error("❌ 통계 로딩 실패:", err));

    API.get("/admin/stats/users/daily")
      .then((res) => {
        const formatted = res.data.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
          }),
          users: entry.users,
        }));
        setUserTrend(formatted);
      })
      .catch((err) => console.error("❌ 가입자 추이 로딩 실패:", err));

    API.get("/admin/analysis/stats/daily")
      .then((res) => setDailyStats(res.data))
      .catch((err) => console.error("❌ 분석 통계 로딩 실패:", err));

    API.get("/admin/analysis/stats/monthly")
      .then((res) => {
        const formatted = res.data.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
          }),
          count: entry.count,
        }));
        setMonthlyAnalysisTrend(formatted);
      })
      .catch((err) => console.error("❌ 월간 분석 추이 로딩 실패:", err));
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-300">
      {/* 헤더 제목 */}
      <div className="text-2xl font-semibold text-slate-800 px-6 pt-6 mb-6">
        관리자 대시보드
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10 px-6">
        <StatCard title="총 회원 수" value={`${totalUsers}명`} />
        <StatCard title="일일 분석 요청" value={`${dailyStats.todayCount}건`} />
        <StatCard
          title="일 평균 매칭률"
          value={`${dailyStats.averageMatchingRate.toFixed(1)}%`}
        />
        <StatCard title="문의글 대기" value={`${pendingSupport}건`} />
        <StatCard title="신고글 대기" value={`${pendingReports}건`} />
      </div>

      {/* 가입자 추이 */}
      <div className="mb-10 px-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-700">
          📈 가입자 추이
        </h3>
        <div className="bg-white p-4 rounded-xl shadow-md">
          {userTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="가입자 수"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-400 py-10">
              📭 가입자 데이터가 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 분석 추이 */}
      <div className="mb-10 px-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-700">
          📊 분석 추이
        </h3>
        <div className="bg-white p-4 rounded-xl shadow-md">
          {monthlyAnalysisTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyAnalysisTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  allowDecimals={false}
                  domain={[0, "dataMax + 5"]}
                  tickCount={6}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                  name="분석 요청 수"
                >
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-400 py-10">
              📭 분석 데이터가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800 text-white p-4 rounded-xl shadow flex flex-col justify-between min-h-[100px]">
      <h3 className="text-sm font-medium text-slate-300">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
