import { useEffect, useState } from "react";
import { Heart, Flag, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import ReportModal from "@/components/community/ReportModal";

const API = import.meta.env.VITE_API_BASE_URL; // ✅ 환경변수에서 API 주소 읽기

export default function CommentCard({ comment, onReload }) {
  const {
    commentId,
    authorName,
    emailMasked,
    content,
    mine,
    likeCount: initialLikeCount,
    deleted,
    createdAt,
    liked: initiallyLiked,
    reported: initiallyReported,
    admin, // 서버에서 보내주는 isAdmin 필드 사용
  } = comment;

  const [user, setUser] = useState(null);
  const isAdmin = admin; // 서버에서 보내주는 isAdmin 필드 사용

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const [liked, setLiked] = useState(initiallyLiked ?? false);
  const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
  const [likeProcessing, setLikeProcessing] = useState(false);
  const [reported, setReported] = useState(initiallyReported ?? false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // 댓글 유형에 따른 배경 그라데이션 및 테두리 설정
  const getCardStyle = () => {
    if (isAdmin) {
      return "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 shadow-emerald-100/50";
    }
    if (mine) {
      return "bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-blue-100/50";
    }
    return "bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 shadow-gray-100/50";
  };

  // 사용자 아바타 색상 및 텍스트
  const getAvatarStyle = () => {
    if (isAdmin) {
      return "bg-gradient-to-r from-emerald-500 to-emerald-600";
    }
    if (mine) {
      return "bg-gradient-to-r from-blue-500 to-blue-600";
    }
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const getAvatarText = () => {
    if (isAdmin) {
      return "관"; // 관리자는 "관"으로 표시
    }
    return authorName?.charAt(0) || "?";
  };

  const handleLikeToggle = async () => {
    if (likeProcessing) return;
    setLikeProcessing(true);

    try {
      const res = await axios.patch(
        `${API}/community/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      alert("조금만 천천히 눌러주세요.");
    } finally {
      setLikeProcessing(false);
    }
  };

  const toggleReport = async (reason) => {
    try {
      const res = await axios.patch(
        `${API}/community/comments/${commentId}/report`,
        { reason },
        { withCredentials: true }
      );

      const data = res.data;

      if (data.reportCount >= 3) {
        alert("신고 누적으로 댓글이 숨김 처리됐어요!");
        window.location.reload();
      } else {
        alert("댓글을 신고했어요. 소중한 제보 감사합니다!");
        setReported(true);
        setShowReportModal(false);
        if (onReload) onReload();
      }
    } catch (err) {
      console.error("신고 실패", err);

      const msg =
        err.response?.data ||
        "신고 처리 중 오류가 발생했어요. 다시 시도해주세요.";

      if (typeof msg === "string") {
        if (msg.includes("본인의 댓글은 신고할 수 없습니다")) {
          alert("본인의 댓글은 신고할 수 없어요!");
        } else if (msg.includes("댓글이 존재하지 않습니다")) {
          alert("댓글이 삭제되었거나 존재하지 않아요.");
        } else {
          alert(msg);
        }
      } else {
        alert("알 수 없는 오류가 발생했어요.");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(content);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(
        `${API}/community/comments/${commentId}`,
        { content: editContent },
        { withCredentials: true }
      );
      alert("댓글이 수정되었습니다.");
      setIsEditing(false);
      if (onReload) onReload();
    } catch (err) {
      console.error("수정 실패", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API}/community/comments/${commentId}`, {
        withCredentials: true,
      });
      alert("댓글이 삭제되었습니다.");
      if (onReload) onReload();
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className={`${getCardStyle()} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {deleted ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">이 댓글은 숨겨졌습니다.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="w-full">
              {/* 사용자 정보 */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-10 h-10 ${getAvatarStyle()} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold">
                    {getAvatarText()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{authorName}</p>
                    {mine && (
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        내 댓글
                      </span>
                    )}
                    {isAdmin && (
                      <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                        관리자
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{emailMasked}</p>
                </div>
              </div>

              {/* 댓글 내용 */}
              {isEditing ? (
                <div className="mb-6">
                  <textarea
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 resize-none shadow-inner"
                    rows={4}
                    maxLength={300}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-400 font-medium">
                      {editContent.length}/300자
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap mb-4 leading-relaxed text-[15px]">
                  {content}
                </p>
              )}

              {/* 작성 시간 */}
              <p className="text-sm text-gray-400 mb-4 font-medium">
                {new Date(createdAt).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
            {isEditing ? (
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleEditSubmit}
                  disabled={!editContent.trim()}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-[0.98] active:scale-95 shadow-lg ${
                    editContent.trim()
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/25"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-300/25"
                  }`}
                >
                  저장하기
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-bold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                {/* 좋아요 */}
                <div className="flex items-center">
                  <button
                    onClick={!likeProcessing ? handleLikeToggle : undefined}
                    disabled={likeProcessing}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-[0.98] active:scale-95 font-semibold shadow-lg ${
                      likeProcessing
                        ? "opacity-50 cursor-not-allowed"
                        : liked
                        ? "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-600 shadow-red-200/50"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-600 hover:from-red-50 hover:to-red-100 hover:border-red-200 hover:text-red-600 shadow-gray-200/50"
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={liked ? "currentColor" : "none"}
                      className="transition-colors duration-200"
                    />
                    <span className="text-sm font-bold">{likeCount}</span>
                  </button>
                </div>

                {/* 우측 액션 버튼들 */}
                <div className="flex items-center gap-3">
                  {/* 신고 버튼 (관리자는 표시 안 함) */}
                  {!isAdmin && (
                    <button
                      onClick={() => {
                        if (mine) {
                          alert("본인의 댓글은 신고할 수 없어요!");
                        } else if (reported) {
                          alert("이미 신고한 댓글이에요.");
                        } else {
                          setShowReportModal(true);
                        }
                      }}
                      className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-[0.98] active:scale-95 shadow-lg ${
                        reported
                          ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 text-yellow-600 shadow-yellow-200/50"
                          : "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-600 hover:from-yellow-50 hover:to-yellow-100 hover:border-yellow-200 hover:text-yellow-600 shadow-gray-200/50"
                      }`}
                    >
                      <Flag
                        size={16}
                        fill={reported ? "currentColor" : "none"}
                        className="transition-colors duration-200"
                      />
                    </button>
                  )}

                  {/* 수정/삭제 버튼 (내 댓글인 경우만) */}
                  {mine && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-600 hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 shadow-lg shadow-gray-200/50"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-600 hover:from-red-50 hover:to-red-100 hover:border-red-200 hover:text-red-600 transition-all duration-200 transform hover:scale-[0.98] active:scale-95 shadow-lg shadow-gray-200/50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {showReportModal && (
            <ReportModal
              onClose={() => setShowReportModal(false)}
              onSubmit={toggleReport}
            />
          )}
        </>
      )}
    </div>
  );
}
