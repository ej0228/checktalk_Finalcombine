import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QnaBoardHeader from "@/components/qna/QnaBoardHeader";
import QnaPostRow from "@/components/qna/QnaPostRow";
import QnaStats from "@/components/qna/QnaStats";
import { ArrowLeft, ArrowRight, Users, AlertCircle } from "lucide-react";
import API from "@/api/axios";

export default function QnaBoard() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  // 로그인 사용자 정보 (userId)
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.userId || null;


  // 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [noticeRes, postRes] = await Promise.all([
          API.get("/support/notices"), // 공지사항
          API.get("/support/posts"),   // 일반글
        ]);

        // 공지글에 type: "notice" 붙이기 (서버에 없으면 클라이언트에서 강제 부여)
        const notices = (noticeRes.data || [])
          .filter((n) => n.pinned)  // 필요에 따라 필터 조정 가능
          .map((n) => ({ ...n, type: "notice" }));

        const inquiries = postRes.data || [];

        setPosts([...notices, ...inquiries]);
      } catch (err) {
        console.error("게시글 불러오기 실패", err);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // 필터링
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (post.authorName?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || (post.status && post.status === filterStatus);

    const matchesType = filterType === "all" || post.type === filterType;

    // 본인 글인지 확인 (userId 비교)
    const isOwner = post.authorUserId === userId;
    const isNotice = post.type === "notice";

    return matchesSearch && matchesStatus && matchesType && (isNotice || isOwner);
  });

  // 공지글과 일반글 분리
  const noticePosts = filteredPosts.filter((post) => post.type === "notice");
  const normalPosts = filteredPosts
    .filter((post) => post.type !== "notice")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 페이징 계산
  const totalPages = Math.ceil(normalPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = normalPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="mb-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="text-gray-600" size={24} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <AlertCircle className="text-blue-600" size={40} />
              고객센터
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-16">
            문의사항과 공지사항을 확인하세요
          </p>
        </div>

        {/* 검색/필터 */}
        <QnaBoardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {/* 게시글 테이블 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-1 text-center">번호</div>
              <div className="col-span-4">제목</div>
              <div className="col-span-3 text-center">작성자</div>
              <div className="col-span-2 text-center">작성일</div>
              <div className="col-span-2 text-center">상태</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {/* 🔔 공지사항 상단 고정 (번호 0부터 시작) */}
            {noticePosts.map((post, i) => (
              <QnaPostRow
                key={`notice-${post.id}`}
                post={post}
                index={i}
                startIndex={0}
              />
            ))}

            {/* 일반 문의글 (페이지네이션 번호 적용) */}
            {currentPosts.map((post, i) => (
              <QnaPostRow
                key={post.id}
                post={post}
                index={i}
                startIndex={startIndex}
              />
            ))}
          </div>

          {/* 검색 결과 없음 안내 */}
          {filteredPosts.length === 0 && (
            <div className="py-16 text-center">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-500 text-sm mt-2">
                다른 검색어나 필터를 사용해보세요.
              </p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 mb-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={16} />
              이전
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              다음
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* 통계 */}
        <QnaStats posts={posts} />
      </div>
    </div>
  );
}
