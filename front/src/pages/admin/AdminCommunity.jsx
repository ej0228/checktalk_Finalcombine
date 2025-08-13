import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import AdminCommunityFilterBar from "@/components/admin/community/AdminCommunityFilterBar";
import AdminCommunityTableRow from "@/components/admin/community/AdminCommunityTableRow";

export default function AdminCommunity() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");

  const size = 10;

  // 페이지 범위 보정 함수 (0 ~ totalPages-1)
  const clamp = (n, tp) => Math.max(0, Math.min(Math.max(tp - 1, 0), n));

  const loadPosts = () => {
    const safePage = clamp(page, totalPages);
    API.get("/admin/reported-comments", {
      params: {
        page: safePage,
        size,
        ...(filterStatus && { status: filterStatus }),
      },
    })
      .then((res) => {
        const data = res.data;
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);

        // 📌 현재 페이지가 비었으면 한 칸 앞으로
        if ((data.content?.length ?? 0) === 0 && safePage > 0) {
          setPage(safePage - 1);
        }
      })
      .catch((err) => {
        console.error("❌ 게시글 불러오기 실패:", err);
        setPosts([]);
      });
  };

  // page, filterStatus 변경 시 로드
  useEffect(() => {
    loadPosts();
  }, [page, filterStatus]);

  // totalPages 변동 시 현재 페이지 보정
  useEffect(() => {
    setPage((p) => clamp(p, totalPages));
  }, [totalPages]);

  const handleRestore = async (id) => {
    try {
      await API.put(`/admin/comments/${id}/restore`);
      loadPosts();
    } catch (err) {
      console.error("❌ 복구 실패:", err);
      alert("복구에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.put(`/admin/comments/${id}/soft-delete`);
      loadPosts();
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const pageGroupSize = 5;
  const currentGroup = Math.floor(page / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);

  return (
    <div className="p-6 bg-slate-300 min-h-screen">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        커뮤니티 신고 관리
      </h2>

      {/* 🔍 필터 박스 */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <AdminCommunityFilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          setPage={() => setPage(0)} // 필터 변경 시 첫 페이지로
        />
      </div>

      {/* 📄 테이블 박스 */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full text-sm text-slate-700 text-center">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">작성자</th>
                <th className="px-4 py-2">내용</th>
                <th className="px-4 py-2">작성일</th>
                <th className="px-4 py-2">신고 수</th>
                <th className="px-4 py-2">신고 사유</th>
                <th className="px-4 py-2">처리 상태</th>
                <th className="px-4 py-2">처리 결과</th>
                <th className="px-4 py-2">조치</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <AdminCommunityTableRow
                    key={post.commentId}
                    post={post}
                    handleRestore={handleRestore}
                    handleDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-slate-500 py-4 bg-slate-50"
                  >
                    📭 신고된 게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 flex-wrap gap-1">
            {/* 이전 */}
            <button
              onClick={() => setPage(clamp(startPage - 1, totalPages))}
              disabled={startPage === 0}
              className="px-3 py-1 text-sm rounded border border-slate-300 text-slate-600 disabled:opacity-50 transition"
            >
              이전
            </button>

            {[...Array(endPage - startPage)].map((_, i) => {
              const pageNumber = startPage + i;
              const isActive = page === pageNumber;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(clamp(pageNumber, totalPages))}
                  className={`w-8 h-8 text-sm rounded border text-center transition
                    ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-indigo-600 border-slate-300 hover:bg-slate-100"
                    }`}
                >
                  {pageNumber + 1}
                </button>
              );
            })}

            {/* 다음 */}
            <button
              onClick={() => setPage(clamp(endPage, totalPages))}
              disabled={endPage >= totalPages}
              className="px-3 py-1 text-sm rounded border border-slate-300 text-slate-600 disabled:opacity-50 transition"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
