import { useEffect, useState } from "react";
import CommentCard from "@/components/community/CommentCard"; // ✅ 댓글 보여주는 컴포넌트
import CommentInput from "@/components/community/CommentInput"; // ✅ 댓글 입력창 컴포넌트
import { fetchComments } from "@/api/Comment";
import { Plus, Users, ArrowLeft, ArrowRight, Heart } from "lucide-react";

const PageButton = ({ page, currentPage, onClick }) => (
  <button
    onClick={() => onClick(page)}
    className={`px-3 py-1 rounded border text-sm ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
  >
    {page}
  </button>
);

const CommunityBoard = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [isWriting, setIsWriting] = useState(false);
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const load = async (pageIndex = 0) => {
    try {
      const res = await fetchComments(pageIndex); // 0-based
      const data = res.data;

      if (!data || !Array.isArray(data.content)) {
        setComments([]);
        setTotalPages(1);
        return;
      }

      let filtered = data.content;
      if (showLikedOnly) {
        filtered = filtered.filter((c) => c.liked);
      }

      setComments(filtered);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error("댓글 불러오기 실패", e);
      setComments([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    load(currentPage - 1);
  }, [currentPage, showLikedOnly]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="text-gray-600" size={24} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-blue-600" size={40} />
              커뮤니티 게시판
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-16">우리의 앱 사용 경험을 공유해보세요!</p>
        </div>

        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowLikedOnly((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[0.98] shadow-md
              ${!showLikedOnly
                ? "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-600 shadow-red-200/50"
                : "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-600 hover:from-red-50 hover:to-red-100 hover:border-red-200 hover:text-red-600 shadow-gray-200/50"
              }`}
          >
            <Heart size={16} fill={!showLikedOnly ? "currentColor" : "none"} />
            {!showLikedOnly ? "하트 누른 댓글만 보기" : "전체 댓글 보기"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {!isWriting ? (
            <button
              onClick={() => setIsWriting(true)}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              <Plus className="text-blue-600" size={20} />
              <span className="text-gray-600">새로운 이야기를 공유해보세요...</span>
            </button>
          ) : (
            <CommentInput onPost={() => {
              setIsWriting(false);
              load(currentPage - 1);
            }} />
          )}
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className={`h-1 ${comment.admin
                  ? "bg-emerald-400"
                  : comment.reported
                    ? "bg-yellow-400"
                    : comment.liked
                      ? "bg-red-400"
                      : comment.mine
                        ? "bg-blue-400"
                        : "bg-gray-200"
                  }`}
              ></div>

              <div className="p-6">
                <CommentCard
                  comment={comment}
                  onReload={() => load(currentPage - 1)}
                  onLikeToggle={(updatedLiked) => {
                    setComments((prev) =>
                      prev.map((c) =>
                        c.commentId === comment.commentId
                          ? { ...c, liked: updatedLiked }
                          : c
                      )
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 mb-8 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border text-sm disabled:text-gray-400"
            >
              ◀
            </button>

            {currentPage > 3 && (
              <>
                <PageButton page={1} currentPage={currentPage} onClick={setCurrentPage} />
                <span className="px-2 text-gray-400">...</span>
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - currentPage) <= 2)
              .map((page) => (
                <PageButton key={page} page={page} currentPage={currentPage} onClick={setCurrentPage} />
              ))}

            {currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <PageButton page={totalPages} currentPage={currentPage} onClick={setCurrentPage} />
              </>
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:text-gray-400"
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityBoard;