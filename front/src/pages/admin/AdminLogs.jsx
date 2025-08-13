import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import AdminLogRow from "@/components/admin/logs/AdminLogRow";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(0);
  const buttonsPerGroup = 5;
  const size = 10;

  // ✅ 페이지 범위 보정
  const clamp = (n, tp) => Math.max(0, Math.min(Math.max(tp - 1, 0), n));

  const getTypeLabel = (type) => {
    switch (type) {
      case "LOGIN":
        return "로그인";
      case "LOGOUT":
        return "로그아웃";
      case "DEACTIVATE_USER":
        return "회원 비활성화";
      case "VIEW_ANALYSIS_DETAIL":
        return "분석기록 상세보기";
      case "SEARCH_ANALYSIS_SUBJECT":
        return "주제 검색";
      case "SEARCH_ANALYSIS_USER":
        return "사용자 검색";
      case "RESTORED_POST":
        return "게시글 복구";
      case "DELETED_POST":
        return "게시글 삭제";
      case "SUPPORT_REPLY_CREATED":
        return "답변 등록";
      case "SUPPORT_REPLY_UPDATED":
        return "답변 수정";
      default:
        return type;
    }
  };

  const getTypeBadgeClass = (type) => {
    if (type === "LOGIN") return "bg-blue-200 text-blue-900";
    if (type === "LOGOUT") return "bg-gray-300 text-gray-800";
    if (type === "DEACTIVATE_USER") return "bg-yellow-200 text-yellow-800";
    if (type === "VIEW_ANALYSIS_DETAIL") return "bg-indigo-200 text-indigo-900";
    if (type === "SEARCH_ANALYSIS_SUBJECT")
      return "bg-purple-200 text-purple-900";
    if (type === "SEARCH_ANALYSIS_USER") return "bg-green-200 text-green-900";
    if (type === "DELETED_POST") return "bg-rose-200 text-rose-900";
    if (type === "RESTORED_POST") return "bg-teal-200 text-teal-900";
    if (type === "SUPPORT_REPLY_CREATED") return "bg-pink-200 text-pink-900";
    if (type === "SUPPORT_REPLY_UPDATED")
      return "bg-orange-200 text-orange-900";
    return "bg-gray-100 text-gray-600";
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadLogs = () => {
    const safePage = clamp(currentPage, totalPages);
    setLoading(true);

    API.get(`/admin/logs?page=${safePage}&size=${size}`)
      .then((res) => {
        setLogs(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);

        // 📌 현재 페이지가 비었으면 한 칸 앞으로
        if ((res.data.content?.length ?? 0) === 0 && safePage > 0) {
          setCurrentPage(safePage - 1);
        }
      })
      .catch((err) => {
        console.error("❌ 관리자 로그 데이터를 불러오는 데 실패했습니다:", err);
        setLogs([]);
      })
      .finally(() => setLoading(false));
  };

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    loadLogs();
  }, [currentPage]);

  // totalPages 변동 시 페이지 보정
  useEffect(() => {
    setCurrentPage((p) => clamp(p, totalPages));
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-slate-300 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          관리자 로그
        </h2>

        <div className="bg-white p-4 rounded-xl shadow-md text-sm">
          {loading ? (
            <p className="text-center text-slate-400 py-10">불러오는 중...</p>
          ) : (
            <>
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-center">번호</th>
                    <th className="px-4 py-3 text-center">작업 유형</th>
                    <th className="px-4 py-3 text-center">관리자</th>
                    <th className="px-4 py-3 text-center">작업 일시</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <AdminLogRow
                        key={log.id}
                        log={log}
                        getTypeLabel={getTypeLabel}
                        getTypeBadgeClass={getTypeBadgeClass}
                        formatDate={formatDate}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-10 text-slate-500 bg-slate-50"
                      >
                        📭 로그 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* ✅ 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-1">
                  {/* 이전 */}
                  <button
                    onClick={() => {
                      const newGroup = Math.max(currentGroup - 1, 0);
                      setCurrentGroup(newGroup);
                      setCurrentPage(
                        clamp(newGroup * buttonsPerGroup, totalPages)
                      );
                    }}
                    disabled={currentGroup === 0}
                    className={`px-3 py-1 rounded border text-sm transition ${
                      currentGroup === 0
                        ? "text-slate-400 border-slate-200 bg-white cursor-not-allowed"
                        : "text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    이전
                  </button>

                  {/* 번호 버튼 */}
                  {Array.from({ length: buttonsPerGroup }, (_, i) => {
                    const pageNum = currentGroup * buttonsPerGroup + i;
                    if (pageNum >= totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setCurrentPage(clamp(pageNum, totalPages))
                        }
                        className={`w-8 h-8 text-sm rounded border transition font-medium ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-indigo-600 border-slate-300 hover:bg-indigo-50"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}

                  {/* 다음 */}
                  <button
                    onClick={() => {
                      const maxGroup = Math.floor(
                        (totalPages - 1) / buttonsPerGroup
                      );
                      const newGroup = Math.min(currentGroup + 1, maxGroup);
                      setCurrentGroup(newGroup);
                      setCurrentPage(
                        clamp(newGroup * buttonsPerGroup, totalPages)
                      );
                    }}
                    disabled={
                      (currentGroup + 1) * buttonsPerGroup >= totalPages
                    }
                    className={`px-3 py-1 rounded border text-sm transition ${
                      (currentGroup + 1) * buttonsPerGroup >= totalPages
                        ? "text-slate-400 border-slate-200 bg-white cursor-not-allowed"
                        : "text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
