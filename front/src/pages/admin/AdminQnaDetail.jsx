// src/pages/admin/AdminQnaDetail.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminQnaReplyForm from "@/components/admin/qna/AdminQnaReplyForm";
import API from "@/api/axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function AdminQnaDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`/admin/qna/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("❌ 게시글 상세 조회 실패:", err));
  }, [id]);

  if (!post) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        ⏳ 문의글을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-300 px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 제목 */}
        <h1 className="text-2xl font-bold text-slate-800">🔍 문의글 상세</h1>

        {/* 문의글 카드 */}
        <div className="bg-white border rounded-xl shadow p-6">
          <p className="font-semibold text-lg text-slate-800 mb-5">
            {post.title}
          </p>
          <p className="text-sm text-slate-500 mb-5">
            작성자: {post.writerEmail}
          </p>
          <hr className="my-4 border-t border-slate-200 mb-5" />
          <p className="text-slate-700 whitespace-pre-line">{post.content}</p>

          {/* 첨부 이미지 */}
          {post.files && post.files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-2 text-slate-700">
                📎 첨부 이미지
              </h4>
              <div className="flex flex-wrap gap-3">
                {post.files.map((file, idx) => (
                  <img
                    key={idx}
                    src={`${baseURL}${file.filePath}`}
                    alt={file.originalName}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 답변 작성 영역 */}
        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 ">
            ✍️ 관리자 답변
          </h2>
          <AdminQnaReplyForm postId={id} />
        </div>
      </div>
    </div>
  );
}
