// 📌 이 컴포넌트는 '사용자 모드'에서만 렌더링됩니다.
// 관리자 모드에서는 접근 경로가 차단되어 있어 실행되지 않습니다.
// (주석 처리 불필요 — 헤더/라우팅에서 관리자 접근 차단됨)
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function CommentInput({ onPost }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text) return alert("내용을 입력해주세요");
    if (submitting) return;

    try {
      setSubmitting(true);
      await axios.post(
        `${API}/community`,
        { content: text },
        { withCredentials: true }
      );
      setContent("");
      onPost?.();
    } catch (err) {
      alert("댓글 등록 실패: " + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="+ 새로운 이야기를 남겨보세요... (Enter 전송 / Shift+Enter 줄바꿈)"
        maxLength={1000}
        className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>{content.length}/1000</span>
        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
          className={`px-4 py-1 rounded text-sm whitespace-nowrap ${
            submitting || !content.trim()
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {submitting ? "등록 중..." : "등록"}
        </button>
      </div>
    </div>
  );
}
