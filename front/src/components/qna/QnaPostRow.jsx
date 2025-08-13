import { Megaphone, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  확인중: "bg-yellow-100 text-yellow-800 border-yellow-200",
  처리중: "bg-blue-100 text-blue-800 border-blue-200",
  처리완료: "bg-green-100 text-green-800 border-green-200",
  보류: "bg-red-100 text-red-800 border-red-200",
};

const colors = [
  "bg-gradient-to-r from-blue-400 to-blue-600",
  "bg-gradient-to-r from-purple-400 to-purple-600",
  "bg-gradient-to-r from-green-400 to-green-600",
  "bg-gradient-to-r from-pink-400 to-pink-600",
  "bg-gradient-to-r from-orange-400 to-orange-600",
  "bg-gradient-to-r from-indigo-400 to-indigo-600",
  "bg-gradient-to-r from-teal-400 to-teal-600",
];

export default function QnaPostRow({ post, index, startIndex }) {
  const navigate = useNavigate();

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

  return (
    <div className="hover:bg-gray-50 transition-colors">
      {post.type === "notice" && (
        <div className={`h-1 ${colors[post.colorIndex % colors.length]}`} />
      )}

      <div
        className="px-6 py-4 cursor-pointer"
        onClick={() =>
          navigate(
            post.type === "notice"
              ? `/support/notices/${post.id}`
              : `/qna/detail/${post.id}`
          )
        }
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* 번호 */}
          <div className="col-span-1 text-center text-sm text-gray-600">
            {post.type === "notice" ? (
              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                공지
              </span>
            ) : (
              startIndex + index + 1
            )}
          </div>

          {/* 제목 */}
          <div className="col-span-4">
            <div className="flex items-center gap-2">
              {post.type === "notice" && (
                <Megaphone className="text-red-600 flex-shrink-0" size={16} />
              )}
              <span
                className={`text-sm ${
                  post.type === "notice"
                    ? "font-semibold text-gray-900"
                    : "text-gray-800"
                }`}
              >
                {post.title}
              </span>
              {post.isNew && (
                <span className="inline-flex items-center px-1.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                  NEW
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">조회 {post.views}</div>
          </div>

          {/* 작성자 */}
          <div className="col-span-3 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    colors[post.colorIndex % colors.length]
                  } flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-xs">
                    {post.authorName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  {post.authorName}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">{post.authorEmail}</span>
            </div>
          </div>

          {/* 날짜 */}
          <div className="col-span-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{formatDateTime(post.createdAt)}</span>
            </div>
          </div>

          {/* 상태 */}
          <div className="col-span-2 text-center">
            {post.status ? (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                  statusColors[post.status]
                }`}
              >
                {post.status}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                공지
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
