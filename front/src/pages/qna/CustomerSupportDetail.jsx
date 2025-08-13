import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import SupportPostHeader from "@/components/qna/SupportPostHeader";
import SupportPostContent from "@/components/qna/SupportPostContent";
import AdminQnaReplyForm from "@/components/admin/qna/AdminQnaReplyForm";


const API = import.meta.env.VITE_API_BASE_URL;


export default function CustomerSupportDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleStartEdit = useCallback(() => setIsEditing(true), []);
  const me = JSON.parse(localStorage.getItem("user"));
const myId = me?.id ?? me?.userId; // 로컬 유저 키 케이스 대응
const ownerId = post?.userId ?? post?.authorUserId ?? post?.authorId; // 응답 키 케이스 대응
 const canEdit = myId != null && ownerId != null && String(myId) === String(ownerId);


  const loadPost = async () => {
    try {
      console.log("📨 불러오기 요청 시작:", id);

      const res = await axios.get(`${API}/support/posts/${id}`, {
        withCredentials: true,
      });

      console.log("✅ 응답 결과:", res.data);

      const postData = res.data;
      const user = JSON.parse(localStorage.getItem("user"));
      const isUserAdmin = user?.role === "ADMIN";
      setIsAdmin(isUserAdmin);

      if (isUserAdmin && postData.status === "처리중") {
        console.log("👑 관리자 상태 업데이트 중...");
        await axios.patch(`${API}/support/posts/${id}/status`, {
          status: "확인중",
        });

        const updated = await axios.get(`${API}/support/posts/${id}`, {
          withCredentials: true,
        });

        console.log("🔄 상태 변경 후 데이터:", updated.data);
        setPost({ ...updated.data, date: updated.data.createdAt });
      } else {
        setPost({ ...postData, date: postData.createdAt });
      }
    } catch (err) {
      console.error("❌ 게시글 불러오기 실패", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("👤 로컬 유저:", user);
    console.log("🧑‍⚖️ 관리자 여부:", user?.role === "ADMIN");

    if (user?.role === "ADMIN") {
      setIsAdmin(true);
    }

    // 여기서 post를 불러와야 합니다!
    loadPost();
  }, [id]);

  const handleEditChange = (key, value) =>
    setPost((prev) => ({ ...prev, [key]: value }));

  const handleCancelEdit = () => {
    loadPost();
    setIsEditing(false);
  };

  const handleSavePost = async () => {
    console.log("저장 직전 post 상태:", post);

    try {
      await axios.put(`${API}/support/posts/${id}`, post, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("게시글 저장 실패:", err);
      alert("수정 실패");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(
        `${API}/support/posts/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setPost((prev) => ({ ...prev, status: newStatus }));
    } catch {
      alert("상태 변경 실패");
    }
  };

  if (!post) return <div className="p-8">게시글을 불러오는 중입니다...⏳</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <SupportPostHeader
          post={post}
          isAdmin={isAdmin}
          isEditing={isEditing}
          
          onStartEdit={handleStartEdit}   // ✅ 추가
          onEdit={handleEditChange}
          onSave={handleSavePost}
          onCancel={handleCancelEdit}
          showStatusPanel={showStatusPanel}
          setShowStatusPanel={setShowStatusPanel}
          onStatusChange={handleStatusChange}
          canEdit={canEdit}      // ✅ 작성자 본인만 true
        />
        <SupportPostContent
          post={post}
          isEditing={isEditing}
          onEdit={handleEditChange}
        />
          {/* 👮 관리자일 경우 답변 입력 */}
          {isAdmin && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">📩 답변 작성</h3>
            <AdminQnaReplyForm postId={id} onReload={loadPost} />
          </div>
        )}

        {/* 🙋 사용자에게는 관리자 답변만 보여줌 */}
        {!isAdmin && post.answerContent && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">🙋 관리자 답변</h3>
            <p className="text-gray-800 whitespace-pre-wrap">
              {post.answerContent}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}