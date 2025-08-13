import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import AdminUserSearchBar from "@/components/admin/users/AdminUserSearchBar";
import AdminUserRow from "@/components/admin/users/AdminUserRow";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("name");

  const size = 10;

  // ✅ 페이지 범위 보정 함수
  const clamp = (n, tp) => Math.max(0, Math.min(Math.max(tp - 1, 0), n));

  const fetchUsers = async (page = 0, searchKeyword = "", type = "name") => {
    try {
      const safePage = clamp(page, totalPages);
      const url = searchKeyword
        ? `/admin/users/search?type=${type}&keyword=${searchKeyword}&page=${safePage}&size=${size}`
        : `/admin/users?page=${safePage}&size=${size}`;

      const response = await API.get(url);
      const content = response.data.content || [];
      setUsers(content);
      setTotalPages(response.data.totalPages || 0);

      // 📌 현재 페이지가 비었으면 한 칸 앞으로
      if (content.length === 0 && safePage > 0) {
        setCurrentPage(safePage - 1);
      }
    } catch (error) {
      console.error("🚨 사용자 목록 가져오기 실패:", error);
      setUsers([]);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("정말 이 사용자를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await API.patch(`/admin/users/${userId}/delete`);
      fetchUsers(currentPage, keyword, searchType);
    } catch (error) {
      console.error("🚨 사용자 삭제 실패:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(clamp(page, totalPages));
  };

  const handleReset = () => {
    setKeyword("");
    setSearchType("name");
    setCurrentPage(0);
    fetchUsers(0);
  };

  // 페이지나 검색 조건 변경 시 데이터 로드
  useEffect(() => {
    fetchUsers(currentPage, keyword, searchType);
  }, [currentPage, keyword, searchType]);

  // totalPages 변동 시 현재 페이지 보정
  useEffect(() => {
    setCurrentPage((p) => clamp(p, totalPages));
  }, [totalPages]);

  return (
    <div className="p-6 bg-slate-300 min-h-screen">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">회원 관리</h2>

      {/* 🔍 검색바 카드 */}
      <AdminUserSearchBar
        searchType={searchType}
        setSearchType={setSearchType}
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={() => setCurrentPage(0)} // 검색 시 첫 페이지로
        onReset={handleReset}
      />

      {/* 📄 테이블 + 페이지네이션 카드 */}
      <div className="bg-white p-4 mt-6 rounded-xl shadow">
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full text-sm text-slate-700 text-center">
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">이메일</th>
                <th className="px-4 py-3">전화번호</th>
                <th className="px-4 py-3">직업</th>
                <th className="px-4 py-3">관리</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <AdminUserRow
                    key={user.userId}
                    user={user}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-slate-500 py-4">
                    사용자 목록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-1 flex-wrap">
            {/* 이전 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm rounded border border-slate-300 text-slate-600 disabled:opacity-50 transition"
            >
              이전
            </button>

            {/* 페이지 번호 버튼 */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`w-8 h-8 text-sm rounded border text-center transition
                  ${
                    currentPage === index
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 border-slate-300 hover:bg-slate-100"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
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

export default AdminUsers;
