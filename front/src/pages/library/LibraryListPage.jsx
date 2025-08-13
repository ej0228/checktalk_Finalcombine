import React, { useState, useEffect } from "react";
import axios from "axios";


import {
  Star,
  Calendar,
  BarChart3,
  MessageCircle,
  Search,
  Filter,
  ChevronRight,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // 화면 전환을 위한 추가
import Pagination from "@/components/Pagination"; // 페이지네이션 컴포넌트

const API = import.meta.env.VITE_API_BASE_URL;

const LibraryListPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]); // ✅ 서버에서 받은 분석 리스트
  const [page, setPage] = useState(0); // ✅ 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 수

  const [searchTerm, setSearchTerm] = useState("");
  const [filterByImportant, setFilterByImportant] = useState(false);

  // ✅ 전체 분석 수
  const [totalElements, setTotalElements] = useState(0);

  //숨긴 분석 목록
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordToHide, setRecordToHide] = useState(null);
  //숨긴 분석 갯수 취합
  const [hiddenCount, setHiddenCount] = useState(0);

  // ✅ 중요도 toggle
  const toggleImportance = async (id) => {
    try {
      // 서버에 토글 요청
      const res = await axios.put(
        `${API}/analysis/${id}/toggle-important`,
        null,
        {
          withCredentials: true,
        }
      );

      const updatedImportant = res.data.isImportant;

      // 프론트 상태도 동기화
      setRecords((prev) =>
        prev.map((record) =>
          record.id === id
            ? { ...record, isImportant: updatedImportant }
            : record
        )
      );
    } catch (e) {
      console.error("중요도 토글 실패", e);
    }
  };

  const handleHideRecord = async () => {
    if (!recordToHide) return;
    try {
      await axios.patch(`${API}/analysis/${recordToHide}/hide`, null, {
        withCredentials: true,
      });
      setRecords((prev) => prev.filter((r) => r.id !== recordToHide));
      setRecordToHide(null);
      setShowConfirmModal(false);
    } catch (e) {
      console.error("숨기기 실패", e);
    }
    //fetchData(page);
    setShowConfirmModal(false); //--> 제일빠름
    //setTimeout(() => window.location.reload(), 300); // 부드러운 방식 --> 느림
  };

  // ✅ 데이터 페칭 (페이지네이션 포함)
  const fetchData = async (page) => {
    try {
      const res = await axios.get(
        `${API}/analysis/analysis-records/my?page=${page}&size=10`,
        {
          withCredentials: true,
        }
      );
      console.log("records 응답 확인:", res.data.content);
      // records.forEach((r) => console.log(r.id, r.isImportant)); ----> 중요도 표시 왜 삭제하죠?
      setRecords(Array.isArray(res.data.content) ? res.data.content : []);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements); // 전체 분석 갯수
    } catch (e) {
      console.error("불러오기 실패", e);
    }
  };

  useEffect(() => {
    fetchData(page);
    axios
      .get(`${API}/analysis/analysis-records/hidden/count`, {
        withCredentials: true,
      })
      .then((res) => {
        setHiddenCount(res.data);
      })
      .catch((err) => {
        console.error("숨겨진 분석 수 불러오기 실패", err);
      });
  }, [page]); // ✅ page 변경 시마다 fetch

  // ✅ 검색 + 중요 필터링  //subject와 userInput 보이게
  const filteredRecords = Array.isArray(records)
    ? records.filter((record) => {
        const subject = record.subject || "";
        const userInput = record.userInput || "";
        const matchesSearch =
          subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userInput.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesImportant = !filterByImportant || record.isImportant;
        return matchesSearch && matchesImportant;
      })
    : [];

  // 매칭률에 따른 색상 반환
  const getMatchingRateColor = (rate) => {
    if (rate <= 50) return "text-red-500";
    if (rate <= 80) return "text-yellow-500";
    return "text-green-500";
  };

  // 매칭률에 따른 배경색 반환
  const getMatchingRateBg = (rate) => {
    if (rate <= 50) return "bg-red-50";
    if (rate <= 80) return "bg-yellow-50";
    return "bg-green-50";
  };

  // 텍스트 자르기 함수
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={40} />
            분석 라이브러리
          </h1>
          <p className="text-gray-600 text-lg">
            지금까지 진행한 이해도 분석 결과를 확인하고 관리하세요.
          </p>
        </div>
        {/* 🖥 PC 전용 */}
        <div className="hidden sm:block">
          {/* 검색 및 필터 영역 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="주제나 내용으로 검색하세요..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setFilterByImportant(!filterByImportant)}
                className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                  filterByImportant
                    ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter size={18} />
                중요 항목만
              </button>
            </div>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">전체 분석</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalElements}개
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">중요 표시</p>
              <p className="text-2xl font-bold text-yellow-600">
                {records.filter((r) => Boolean(r.isImportant)).length}개
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">평균 매칭률</p>
              <p className="text-2xl font-bold text-green-600">
                {records.length === 0
                  ? 0
                  : Math.round(
                      records.reduce((sum, r) => sum + r.matchingRate, 0) /
                        records.length
                    )}
                %
              </p>
            </div>
            <div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate("/libH")}
            >
              <p className="text-sm text-gray-600">숨겨진 분석</p>
              <p className="text-2xl font-bold text-gray-500">
                {hiddenCount}개
              </p>
            </div>
          </div>

          {/* 분석 목록 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* 헤더 */}
            <div className="border-b border-gray-200 p-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-1 text-center">중요도</div>
                <div className="col-span-2">날짜</div>
                <div className="col-span-1 text-center">매칭률</div>
                <div className="col-span-5">본인 이해 내용</div>
                <div className="col-span-1 text-center">노트</div>
                <div className="col-span-1 text-center">숨기기</div>
                <div className="col-span-1"></div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* 목록 내용 */}
            <div className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <BarChart3 className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-lg">검색 결과가 없습니다.</p>
                  <p className="text-sm">다른 검색어로 다시 시도해보세요.</p>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* 중요도 */}
                      <div className="col-span-1 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleImportance(record.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Star
                            size={20}
                            strokeWidth={2}
                            stroke={record.isImportant ? "#facc15" : "#d1d5db"} // yellow-400 vs gray-300
                            fill={record.isImportant ? "#facc15" : "none"}
                            className="transition-colors"
                          />
                        </button>
                      </div>

                      {/* 날짜 */}
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-900">
                          {record.date}
                        </p>
                        <p className="text-xs text-gray-500">
                          {record.createdAt}
                        </p>
                      </div>

                      {/* 매칭률 */}
                      <div className="col-span-1 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getMatchingRateBg(
                            record.matchingRate
                          )}`}
                        >
                          <span
                            className={`text-sm font-bold ${getMatchingRateColor(
                              record.matchingRate
                            )}`}
                          >
                            {Math.round(record.matchingRate)}%
                          </span>
                        </div>
                      </div>

                      {/* 본인 이해 내용 */}
                      <div className="col-span-5">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {truncateText(record.subject, 50)}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {truncateText(record.userInput, 120)}
                        </p>
                      </div>

                      {/* 노트 수 */}
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
                          className="hover:text-red-500"
                          onClick={() => {
                            setRecordToHide(record.id);
                            setShowConfirmModal(true);
                          }}
                        >
                          <EyeOff size={18} />
                        </button>
                      </div>

                      {/* 상세보기 버튼 */}
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() =>
                            navigate(`/library/detail/${record.id}`)
                          }
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <p className="text-sm text-gray-500">
              총 {totalElements}개 중 {filteredRecords.length}개의 분석 결과
            </p>
          </div>
        </div>

        {/* 📱 모바일 전용 */}
        <div className="block sm:hidden space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <BarChart3 className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-lg">분석 결과가 없습니다.</p>
              <p className="text-sm">다른 검색어로 다시 시도해보세요.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white p-4 rounded-xl shadow border"
              >
                <div className="flex justify-between items-center mb-2">
                  {/* 중요도 아이콘 */}
                  <div>
                    {record.isImportant ? (
                      <Star
                        fill="currentColor"
                        className="text-yellow-400"
                        size={20}
                      />
                    ) : (
                      <Star className="text-gray-300" size={20} />
                    )}
                  </div>

                  {/* 매칭률 */}
                  <div
                    className={`text-sm font-bold px-2 py-1 rounded-full ${
                      record.matchingRate >= 70
                        ? "bg-green-100 text-green-700"
                        : record.matchingRate >= 40
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Math.round(record.matchingRate)}%
                  </div>
                </div>

                {/* 이해 내용 */}
                <span
                  onClick={() => navigate(`/library/detail/${record.id}`)}
                  className="text-sm text-gray-800 font-medium truncate mb-1 hover:text-blue-600 cursor-pointer"
                >
                  <p className="text-sm text-gray-800 font-medium truncate mb-1">
                    {record.subject}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {record.userInput}
                  </p>
                </span>
                {/* 기능 아이콘들 */}
                <div className="flex justify-end gap-4 mt-3 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {record.noteCount}
                  </div>
                  <button
                    onClick={() => {
                      setRecordToHide(record.id);
                      setShowConfirmModal(true);
                    }}
                    className="hover:text-red-500"
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          color="blue"
        />
        {/* 실수방지 숨김 모달창 */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          >
            <div className="bg-white p-4 rounded-lg shadow-2xl w-64 max-w-sm border border-gray-100">
              <p className="text-base font-semibold text-gray-800 mb-3">
                이 분석 결과를 숨기시겠어요?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-3 py-1.5 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleHideRecord}
                  className="px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  숨기기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryListPage;
