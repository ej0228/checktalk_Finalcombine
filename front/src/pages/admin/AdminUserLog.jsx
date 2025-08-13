import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import AdminPagination from "@/components/AdminPagination";
import AdminUserLogSearchBar from "@/components/admin/userlog/AdminUserLogSearchBar";
import AdminUserLogRow from "@/components/admin/userlog/AdminUserLogRow";

export default function AdminUserLog() {
  const [logList, setLogList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ 로그인 로그 불러오기
  const fetchLogs = async (page = 0) => {
    try {
      setLoading(true);
      const res = await API.get("/admin/user-log/list", {
        params: {
          page,
          size: 10,
          name: searchName || null,
          startDate: startDate || null,
          endDate: endDate || null,
        },
      });
      setLogList(res.data.content);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      console.error("❌ 로그인 로그 조회 실패", err);
      setError("로그 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지 변경 시 데이터 요청
  useEffect(() => {
    fetchLogs(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // ✅ 검색 실행
  const handleSearch = () => {
    setCurrentPage(0);
    fetchLogs(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 제목 */}
        <h2 className="text-2xl font-bold text-slate-800">
          👣 사용자 로그인 로그
        </h2>

        {/* 검색 영역 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <AdminUserLogSearchBar
            searchName={searchName}
            setSearchName={setSearchName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onSearch={handleSearch}
          />
        </div>

        {/* 테이블을 카드 박스로 감싸기 */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-4 py-3 text-center">#</th>
                  <th className="px-4 py-3 text-center">사용자 이름</th>
                  <th className="px-4 py-3 text-center">IP 주소</th>
                  <th className="px-4 py-3 text-center">로그인 시각</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-500">
                      ⏳ 불러오는 중...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : logList.length > 0 ? (
                  logList.map((log, index) => (
                    <AdminUserLogRow
                      key={log.id}
                      log={log}
                      index={index + 1 + currentPage * 10}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-400">
                      📭 로그가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center pt-6">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
