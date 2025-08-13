import { Calendar, User } from "lucide-react";
import StatusBadge from "@/components/qna/StatusBadge";

const colors = [
  "bg-gradient-to-r from-blue-400 to-blue-600",
  "bg-gradient-to-r from-purple-400 to-purple-600",
  "bg-gradient-to-r from-green-400 to-green-600",
  "bg-gradient-to-r from-pink-400 to-pink-600",
  "bg-gradient-to-r from-orange-400 to-orange-600",
  "bg-gradient-to-r from-indigo-400 to-indigo-600",
  "bg-gradient-to-r from-teal-400 to-teal-600",
];

export default function SupportPostHeader({
  post,

  isEditing,
  onEdit,
  onSave,
  onCancel,
  showStatusPanel,
  setShowStatusPanel,
  onStatusChange,
  onStartEdit,
  canEdit,
}) {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "날짜 없음";
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${d} ${h}:${min}`;
  };

  const profileColor =
    colors[
      typeof post?.colorIndex === "number" ? post.colorIndex % colors.length : 0
    ];

  const authorInitial = post?.authorName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* 왼쪽: 제목 및 정보 */}
        <div className="flex-1">
          {isEditing ? (
            <input
              value={post?.title || ""}
              onChange={(e) => onEdit("title", e.target.value)}
              className="w-full text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none pb-2 mb-4"
              placeholder="제목을 입력하세요"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {post?.title}
            </h2>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
            {/* 🧸 작성자 */}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div
                className={`w-6 h-6 rounded-full ${profileColor} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-xs">
                  {authorInitial}
                </span>
              </div>
              <span className="text-gray-800 font-medium truncate max-w-[100px]">
                {post?.authorName || "작성자 없음"}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[160px]">
                {post?.authorEmail || "이메일 없음"}
              </span>
            </div>

            {/* 날짜 & 조회수 → 오른쪽 고정! */}
            <div className="flex items-center gap-4 sm:ml-auto">
              <div className="flex items-center gap-1">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700">
                  {formatDateTime(post?.date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700">
                  조회 {post?.views ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 상태 뱃지 + 버튼 */}
        <div className="flex items-center gap-3">
          {post?.status && (
            <StatusBadge
              status={post.status}
              isAdmin={false} // 사용자모드라면 패널 안 열리게 하거나 필요 시 제거
              show={showStatusPanel}
              setShow={setShowStatusPanel}
              onChange={onStatusChange}
            />
          )}

          {/* 편집/저장/취소 */}
          {canEdit &&
            (isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  aria-label="저장하기"
                >
                  저장
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                  aria-label="취소하기"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onStartEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  aria-label="수정하기"
                >
                  수정
                </button>
                {/* <button
        onClick={() => alert("삭제 기능은 업데이트 예정입니다.")}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        aria-label="삭제하기"
      >
        삭제
      </button> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
