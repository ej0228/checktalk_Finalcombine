import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPinnedNotices } from "@/api/notice";
import API from "@/api/axios"; // fallback용

export default function NoticeBanner() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // 기본: 핀 공지만 호출
        const list = await getPinnedNotices();
        setItems(list);
      } catch {
        // 서버 필터가 없으면 posts에서 type/pinned로 클라필터 (임시)
        const res = await API.get("/support/notices");
        const list = (res.data || [])
          .filter((n) => n.pinned || n.type === "notice")
          .slice(0, 3);
        setItems(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !items.length) return null;

  return (
    <div className="mb-6 rounded-xl border bg-blue-50 border-blue-200">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-blue-200">
        <Megaphone className="w-5 h-5 text-blue-700" />
        <strong className="text-blue-800">공지사항</strong>
      </div>
      <ul className="divide-y divide-blue-200">
        {items.map((n) => (
          <li
            key={n.id}
            className="px-4 py-3 hover:bg-blue-100 cursor-pointer"
            onClick={() => nav(`/support/notices/${n.id}`)}
          >
            <span className="text-sm text-blue-900">{n.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
