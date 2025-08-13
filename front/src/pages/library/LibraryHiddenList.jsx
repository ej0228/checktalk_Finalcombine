import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";

const API = import.meta.env.VITE_API_BASE_URL;

const LibraryHiddenList = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchData = async (page) => {
    try {
      const res = await axios.get(
        `${API}/analysis/analysis-records/hidden?page=${page}&size=10`,
        { withCredentials: true }
      );
      setRecords(Array.isArray(res.data.content) ? res.data.content : []);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (e) {
      console.error("숨긴 분석 불러오기 실패", e);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleRestore = async (id) => {
    const confirmed = window.confirm("이 분석을 복구하시겠습니까?");
    if (!confirmed) return;
    try {
      await axios.patch(`${API}/analysis/${id}/restore`, null, {
        withCredentials: true,
      });
      navigate(`/library/detail/${id}`); // ✅ 해당 상세보기 페이지로 이동
    } catch (e) {
      console.error("복구 실패", e);
    }
    fetchData(page);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length > maxLength) return text.slice(0, maxLength) + "...";
    return text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}

        <div className="mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)} // 이전 페이지로 이동
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-gray-600" size={24} />
            </button>
            <BarChart3 className="text-blue-600" size={40} />
            숨겨진 라이브러리
          </h1>
          <p className="text-gray-600 text-lg">
            숨겨진 분석내용은 숨겨지고 30일 이후 삭제됩니다. (숨긴목록 모바일
            확인 불가)
          </p>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">숨겨진 분석</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalElements}개
                </p>
              </div>
              <BarChart3 className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* 분석 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
              <div className="col-span-2">숨겨진 날짜</div>
              <div className="col-span-1 text-center">매칭률</div>
              <div className="col-span-7">본인 이해 내용</div>
              <div className="col-span-1 text-center">노트</div>
              <div className="col-span-1 text-center">복구</div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {records.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <BarChart3 className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg">숨겨진 분석이 없습니다.</p>
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 text-sm font-medium text-gray-900">
                      {record.hiddenAt || "-"}
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        <span className="text-sm font-bold text-gray-700">
                          {Math.round(record.matchingRate)}%
                        </span>
                      </div>
                    </div>
                    <div className="col-span-7">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {truncateText(record.subject, 50)}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {truncateText(record.userInput, 120)}
                      </p>
                      <p className="text-sm text-red-500 mt-1">
                        삭제 예정일: {record.scheduledDeletion}
                      </p>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageCircle size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {record.noteCount}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => handleRestore(record.id)}
                        className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        복구
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 페이지네이션 */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          color="blue"
        />

        <div className="mt-8 flex justify-center">
          <p className="text-sm text-gray-500">
            총 {totalElements}개 중 {records.length}개의 숨겨진 분석 결과
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibraryHiddenList;
