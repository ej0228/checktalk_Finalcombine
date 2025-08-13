import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  Star,
  Calendar,
  BarChart3,
  MessageCircle,
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  FileText,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const LibraryDetailPage = () => {
  const { id: analysisId } = useParams(); // /library/:id 와 같은 라우팅 구조 필요
  const [analysisDetail, setAnalysisDetail] = useState(null);
  const [isImportant, setIsImportant] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [relatedPage, setRelatedPage] = useState(0);
  const [hasMoreRelated, setHasMoreRelated] = useState(true);
  const navigate = useNavigate();
  const [relatedAnalyses, setRelatedAnalyses] = useState([]);
  const [relatedMeta, setRelatedMeta] = useState({ page: 0, totalPages: 1 });

  useEffect(() => {
    if (!analysisId) return;

    setRelatedAnalyses([]); // ✅ 분석 ID 바뀌면 초기화
    setRelatedPage(0);
    setHasMoreRelated(true);

    // 분석 상세 정보 조회
    axios
      .get(`${API}/analysis/${analysisId}`, { withCredentials: true })
      .then((res) => {
        console.log("✔ 분석 정보:", res.data); // 꼭 확인
        setAnalysisDetail(res.data);
        setIsImportant(res.data.isImportant); // 중요도 표시
      });

    // 노트 불러오기
    axios
      .get(`${API}/notes/${analysisId}`, { withCredentials: true }) //✅ PathVariable 방식
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("노트 에러", err));

    // 연관 분석 처음 1페이지 불러오기
    loadRelatedTopics(0);
  }, [analysisId]);

  const loadRelatedTopics = (page) => {
    axios
    .get(`${API}/analysis/${analysisId}/related?page=${page}&size=3`, {
      withCredentials: true, // ✅ 세션 쿠키 전송
    })

      .then((res) => {
        setRelatedAnalyses(res.data.content); // ✅ 덮어쓰기
        setRelatedMeta({
          page: res.data.number,
          totalPages: res.data.totalPages,
        });
      })
      .catch((err) => console.error("연관 주제 불러오기 실패", err));
  };

  // ✅ 상세 페이지용 중요도 토글 함수
  const handleToggleImportant = async () => {
    try {
      const res = await axios.put(
        `${API}/analysis/${analysisId}/toggle-important`,
        null,
        { withCredentials: true }
      );
      setIsImportant(res.data.isImportant);
    } catch (e) {
      console.error("중요도 토글 실패", e);
      alert("중요도 변경에 실패했습니다.");
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await axios.post(
        `${API}/notes/${analysisId}`,
        newNote.trim(),
        {
          headers: {
            "Content-Type": "text/plain", // 👈 중요!
          },
          withCredentials: true,
        }
      );
      setNotes([...notes, res.data]);
      setNewNote("");
      setIsAddingNote(false);
    } catch (e) {
      alert("노트 추가에 실패했습니다.");
      console.error(e);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${API}/notes/${noteId}`, { withCredentials: true });
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (e) {
      alert("노트 삭제에 실패했습니다.");
    }
  };

  const getMatchingRateColor = (rate) => {
    if (rate <= 50) return "text-red-500";
    if (rate <= 80) return "text-yellow-500";
    return "text-green-500";
  };

  const getMatchingRateBg = (rate) => {
    if (rate <= 50) return "bg-red-50 border-red-200";
    if (rate <= 80) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const handleHide = async () => {
    const confirmed = window.confirm("이 분석을 숨기시겠습니까?");
    if (!confirmed) return;
    try {
      await axios.patch(`${API}/analysis/${analysisId}/hide`, null, {
        withCredentials: true,
      });
      alert("분석이 숨겨졌습니다.");
      navigate("/lib");
    } catch (error) {
      console.error("숨기기 실패", error);
      alert("숨기기에 실패했습니다.");
    }
  };

  //데이터가 아직 준비되지 않았으면 로딩 화면 보여줌
  if (!analysisDetail) return <div>로딩 중...</div>;

  //여기서 부터 jsx 시작
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-between mb-4">
            {/* 왼쪽: 뒤로가기 + 제목 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/lib")} // 이전 페이지로 이동
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="text-gray-600" size={24} />
              </button>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="text-blue-600" size={40} />
                분석 결과 상세
              </h1>
            </div>
            
            {/* 오른쪽: 중요도 버튼 */}
            <button
              onClick={handleToggleImportant}
              className="p-1 hover:bg-gray-100 rounded transition-colors mr-4"
            >
              <Star
                size={24}
                strokeWidth={2}
                stroke={isImportant ? "#facc15" : "#d1d5db"} // yellow-400 vs gray-300
                fill={isImportant ? "#facc15" : "none"}
                className="transition-colors"
              />
            </button>
          </div>
        </div>

        {/* 날짜 및 매칭률 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" size={30} />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(analysisDetail.createdAt).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(analysisDetail.createdAt).toLocaleTimeString(
                      "ko-KR",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 ${getMatchingRateBg(
                analysisDetail.matchingRate
              )}`}
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">매칭률</p>
                <p
                  className={`text-3xl font-bold ${getMatchingRateColor(
                    analysisDetail.matchingRate
                  )}`}
                >
                  {analysisDetail?.result?.matchingRate != null
                    ? `${Math.round(analysisDetail.result.matchingRate)}%`
                    : "매칭률 없음"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 원본 내용 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">원본 내용</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border">
            <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {analysisDetail.originalText}
            </pre>
          </div>
        </div>

        {/* 본인 작성 내용 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Edit3 className="text-green-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              본인이 이해한 내용
            </h2>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-gray-800 text-sm leading-relaxed">
              {analysisDetail.userText}
            </p>
          </div>
        </div>

        {/* 연관 주제 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">연관 주제</h2>
          </div>
          <div className="space-y-4">
            {relatedAnalyses.map((analysis, index) => (
              <div
                key={`${analysis.id}-${index}`} // 항상 유일 한 key 생성
                className="bg-gray-50 p-4 rounded border cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => navigate(`/library/detail/${analysis.id}`)} // 클릭 시 이동
              >
                {/* 연관 주제 제목 */}
                <p className="text-sm font-semibold text-gray-800">
                  {analysis.subject}
                </p>

                {/* 사용자 작성 내용 (미리보기) */}
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {analysis.userText?.slice(0, 40)}
                  {analysis.userText?.length > 40 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-center mb-8">
          <button
            disabled={relatedMeta.page === 0}
            onClick={() => loadRelatedTopics(relatedMeta.page - 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            이전
          </button>

          {Array.from({ length: relatedMeta.totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => loadRelatedTopics(idx)}
              className={`px-3 py-1 rounded ${
                idx === relatedMeta.page
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={relatedMeta.page === relatedMeta.totalPages - 1}
            onClick={() => loadRelatedTopics(relatedMeta.page + 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>

        {/* 노트 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-gray-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">노트</h2>
            </div>
            {!isAddingNote && (
              <button
                onClick={() => setIsAddingNote(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                노트 추가
              </button>
            )}
          </div>

          {/* 노트 추가 폼 */}
          {isAddingNote && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="노트를 입력하세요..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          )}

          {/* 기존 노트들 */}
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle
                  className="mx-auto mb-2 text-gray-300"
                  size={32}
                />
                <p>아직 추가된 노트가 없습니다.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">
                      {note.createdAt}
                    </span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        {/* 숨기기 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleHide}
            className="px-6 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
          >
            이 분석 숨기기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryDetailPage;