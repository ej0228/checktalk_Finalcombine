// src/components/admin/qna/AdminQnaReplyForm.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/axios";

export default function AdminQnaReplyForm({ postId }) {
  const [answer, setAnswer] = useState("");
  const [hasAnswer, setHasAnswer] = useState(false);
  const navigate = useNavigate();

  // ✅ 기존 답변 불러오기
  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const res = await API.get(`/admin/qna/posts/${postId}`);
        if (res.data.answerContent) {
          setAnswer(res.data.answerContent);
          setHasAnswer(true);
        }
      } catch (err) {
        console.error("❌ 답변 로딩 실패:", err);
      }
    };

    fetchAnswer();
  }, [postId]);

  // ✅ 등록 또는 수정 처리
  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      if (hasAnswer) {
        await API.put(`/admin/qna/${postId}/answer`, { content: answer });
        alert("✅ 답변이 수정되었습니다.");
      } else {
        await API.post(`/admin/qna/${postId}/answer`, { content: answer });
        alert("✅ 답변이 등록되었습니다.");
      }

      navigate("/admin/support");
    } catch (err) {
      console.error("❌ 답변 등록/수정 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow p-6 text-sm">
      <textarea
        className="w-full min-h-[150px] p-3 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        placeholder="답변 내용을 입력하세요..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow"
        >
          {hasAnswer ? "답변 수정" : "답변 등록"}
        </button>
      </div>
    </div>
  );
}
