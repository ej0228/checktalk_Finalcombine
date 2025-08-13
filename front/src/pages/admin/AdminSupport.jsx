import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/axios";
import AdminSupportFilterBar from "@/components/admin/support/AdminSupportFilterBar";
import AdminSupportTableRow from "@/components/admin/support/AdminSupportTableRow";
import AdminPagination from "@/components/admin/common/AdminPagination";
import AdminNoticeTable from "@/components/admin/support/AdminNoticeTable";

export default function AdminSupport() {
  const navigate = useNavigate();
  const [supportList, setSupportList] = useState([]);
  const [page, setPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("전체");

  const size = 5;

  // ✅ 페이지 범위 보정 함수
  const clamp = (n, tp) => Math.max(0, Math.min(Math.max(tp - 1, 0), n));

  const fetchData = async () => {
    try {
      const safePage = clamp(page, totalPages);
      const params = { page: safePage, size };

      if (statusFilter !== "전체") {
        params.status = statusFilter;
      }

      const res = await API.get("/admin/qna", { params });
      setSupportList(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);

      // 📌 현재 페이지가 비었으면 한 칸 앞으로
      if ((res.data.content?.length ?? 0) === 0 && safePage > 0) {
        setPage(safePage - 1);
      }
    } catch (err) {
      console.error("❌ 고객센터 목록 불러오기 실패:", err);
      setSupportList([]);
    }
  };

  // 페이지 또는 필터 변경 시 데이터 로드
  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  // totalPages 변동 시 현재 페이지 보정
  useEffect(() => {
    setPage((p) => clamp(p, totalPages));
  }, [totalPages]);

  const goToDetail = (id) => {
    navigate(`/admin/qna/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ✅ 공지 테이블 */}
      <AdminNoticeTable />

      <div className="min-h-screen bg-slate-300 px-6 py-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          고객센터 문의관리
        </h2>

        {/* 🔍 필터바 */}
        <div className="mb-3 bg-white p-4 rounded-xl shadow-md">
          <AdminSupportFilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setPage={() => setPage(0)} // 필터 변경 시 첫 페이지로
          />
        </div>

        {/* 📄 테이블 + 페이지네이션 */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <table className="min-w-full text-sm text-slate-700 text-left">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th className="px-4 py-3 text-center">문의 ID</th>
                <th className="px-4 py-3 text-center">이메일</th>
                <th className="px-4 py-3 text-center">제목</th>
                <th className="px-4 py-3 text-center">작성일</th>
                <th className="px-4 py-3 text-center">답변 상태</th>
                <th className="px-4 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {supportList.length > 0 ? (
                supportList.map((q) => (
                  <AdminSupportTableRow
                    key={q.postId}
                    item={q}
                    goToDetail={goToDetail}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-slate-500 bg-slate-50"
                  >
                    📭 문의글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 📑 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <AdminPagination
                currentPage={page} // 0-based 유지
                totalPages={totalPages}
                onPageChange={(p0) => setPage(clamp(p0, totalPages))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
