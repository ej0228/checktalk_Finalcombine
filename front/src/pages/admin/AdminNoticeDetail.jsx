import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Megaphone } from "lucide-react";
import API from "@/api/axios";

export default function AdminNoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();                // 있으면 수정, 없으면 작성
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✅ 추가: 핀/노출 상태 (요구사항 반영)
  const [pinned, setPinned] = useState(true);   // ← 기본값 true
  const [visible, setVisible] = useState(true); // ← 기본값 true

  // ✅ 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (!isEditMode) return;
    (async () => {
      try {
        const res = await API.get(`/admin/notice/${id}`);
        const { title, content, pinned, visible } = res.data;
        setTitle(title ?? "");
        setContent(content ?? "");
        setPinned(pinned ?? true);
        setVisible(visible ?? true);
      } catch (err) {
        alert("공지사항 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      }
    })();
  }, [id, isEditMode]);

  // ✅ 저장 (등록/수정)
  const handleSave = async () => {
    try {
      if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }
      const payload = { title, content, pinned, visible };

      if (isEditMode) {
        await API.put(`/admin/notice/${id}`, payload);
        alert("공지사항이 수정되었습니다.");
      } else {
        await API.post(`/admin/notice`, payload);
        alert("공지사항이 등록되었습니다.");
      }
      navigate("/admin/support");
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // ✅ 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await API.delete(`/admin/notice/${id}`);
      alert("공지사항이 삭제되었습니다.");
      navigate("/admin/support");
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow border border-gray-200">
      {/* 제목 + 아이콘 */}
      <div className="flex items-center gap-2 mb-6">
        <Megaphone className="text-red-500" />
        <h2 className="text-2xl font-bold">{isEditMode ? "공지사항 수정" : "공지사항 작성"}</h2>
      </div>

      {/* 제목 */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">제목</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="공지 제목을 입력하세요"
        />
      </div>

      {/* 내용 */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">내용</label>
        <textarea
          className="w-full border border-gray-300 rounded px-4 py-2 min-h-[200px] focus:outline-none focus:ring focus:border-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="공지 내용을 입력하세요"
        />
      </div>

      {/* ✅ 핀/노출 토글 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setPinned((v) => !v)}
          className={`px-3 py-1 rounded border ${pinned ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-300"}`}
          title="상단 고정 여부"
        >
          {pinned ? "📌 고정됨 (클릭 시 해제)" : "핀 없음 (클릭 시 고정)"}
        </button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
          공개(visible)
        </label>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate("/admin/support")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          목록
        </button>

        <div className="space-x-2">
          {isEditMode && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              삭제
            </button>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {isEditMode ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
