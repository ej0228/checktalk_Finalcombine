// src/pages/admin/support/AdminNoticeTable.jsx
import { useEffect, useState } from "react";
import { Megaphone, Pin, Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/api/axios";

export default function AdminNoticeTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 대응(없어도 동작)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const nav = useNavigate();

  const fmtDate = (v) => {
    if (!v) return "-";
    try {
      return new Date(v).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    } catch {
      return v;
    }
  };

  const fetchList = async (p = 0) => {
    setLoading(true);
    try {
      // ✅ 1) 페이지네이션이 있는 경우: {content, totalPages}
      const res = await API.get("/admin/notice", { params: { page: p, size: 5 } });
      const data = res.data;

      if (Array.isArray(data)) {
        // ✅ 2) 배열만 내려오는 경우(비페이지): 클라에서 페이징 흉내
        const pageSize = 10;
        const start = p * pageSize;
        const end = start + pageSize;
        setRows(data.slice(start, end));
        setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)));
        setPage(p);
      } else {
        setRows(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
        setPage(p);
      }
    } catch {
      setRows([]);
      setTotalPages(1);
      setPage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(0); }, []);

  if (loading) return null;

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 헤더 + 작성 버튼 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Megaphone className="text-indigo-600" />
          <h2 className="text-lg font-semibold">공지사항</h2>
        </div>
        <button
          onClick={() => nav("/admin/support/notices/new")}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus size={16} /> 공지 작성
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 text-gray-700">
            <tr className="text-sm">
              <th className="px-6 py-3 text-center w-24">공지 ID</th>
              <th className="px-6 py-3 text-center">제목</th>
              <th className="px-6 py-3 text-center w-40">작성일</th>
              <th className="px-6 py-3 text-center w-24">핀</th>
              <th className="px-6 py-3 text-center w-28">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600 text-center ">{n.id}</td>
                <td
                  className="px-6 py-4 text-sm text-indigo-700  text-center cursor-pointer truncate"
                  onClick={() => nav(`/admin/support/notices/${n.id}`)}
                  title="상세/수정으로 이동"
                >
                  {n.title}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {fmtDate(n.createdAt || n.createdDate)}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {n.pinned ? <Pin className="inline-block text-gray-700" size={18} /> : "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex justify-center">
                    <button
                      onClick={() => nav(`/admin/support/notices/${n.id}`)}
                      className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                       수정
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 (문의 목록과 동일 규격) */}
      <div className="flex items-center justify-center gap-2 py-4">
        <button
          className="h-9 min-w-9 px-3 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-100"
          disabled={page === 0}
          onClick={() => fetchList(page - 1)}
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`h-9 min-w-9 px-3 rounded-lg border ${
              page === i
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => fetchList(i)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="h-9 min-w-9 px-3 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-100"
          disabled={page >= totalPages - 1}
          onClick={() => fetchList(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
