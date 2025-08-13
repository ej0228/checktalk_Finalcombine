import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Megaphone, Calendar } from "lucide-react";
import API from "@/api/axios";

export default function UserNoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await API.get(`/support/notices/${id}`);
        setNotice(res.data);
      } catch (err) {
        alert("공지사항 정보를 불러오는 데 실패했습니다.");
        navigate("/support");
      }
    };
    fetchNotice();
  }, [id, navigate]);

  if (!notice) {
    return <div className="p-8">공지사항을 불러오는 중입니다...⏳</div>;
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-200">
        {/* 제목 및 아이콘 */}
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="text-red-500" />
          <h2 className="text-2xl font-bold">{notice.title}</h2>
        </div>

        {/* 작성자 및 날짜 */}
        <div className="flex items-center gap-6 mb-6 text-gray-600">
          <div>작성자: {notice.writerName || "알 수 없음"}</div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDateTime(notice.createdAt)}</span>
          </div>
        </div>

        {/* 제목과 본문 사이 회색 구분선 */}
        <hr className="border-gray-300 mb-6" />

        {/* 본문 내용 */}
        <div className="whitespace-pre-wrap text-gray-800">{notice.content}</div>

        {/* 목록 버튼 */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/qna")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
}
