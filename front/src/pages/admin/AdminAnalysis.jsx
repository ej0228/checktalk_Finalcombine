import React, { useEffect, useState, useRef } from "react";
import API from "@/api/axios";
import AdminAnalysisSearchBar from "@/components/admin/analysis/AdminAnalysisSearchBar";
import AdminAnalysisTable from "@/components/admin/analysis/AdminAnalysisTable";
import AdminPagination from "@/components/admin/common/AdminPagination";

export default function AdminAnalysis() {
  // 목록/상태
  const [analysisList, setAnalysisList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // 페이지는 1-based 로 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 검색
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("user");

  // 기타
  const size = 5;
  const isMounted = useRef(false);

  // 1~totalPages 보정
  const clamp = (n, tp) => Math.max(1, Math.min(tp || 1, n));

  // 데이터 로드
  const fetchData = async (page1Based) => {
    const safePage = clamp(page1Based, totalPages);
    console.log(
      "[Parent] fetchData → safePage(1-based):",
      safePage,
      "keyword:",
      searchKeyword,
      "type:",
      searchType
    );

    try {
      const res = await API.get("/admin/analysis/list", {
        params: {
          page: safePage - 1, // API는 0-based
          size,
          keyword: searchKeyword,
          type: searchType,
        },
      });

      const content = Array.isArray(res.data?.content) ? res.data.content : [];
      const tpRaw = res.data?.totalPages;
      const tp = Number.isFinite(tpRaw) ? tpRaw : 0;

      console.log(
        "[API] status 200 → totalPages:",
        tp,
        "| content length:",
        content.length,
        "| requested page(0-based):",
        safePage - 1
      );

      // 목록/페이지 수를 먼저 세팅
      setAnalysisList(content);
      setTotalPages(tp > 0 ? tp : 0);

      // 현재 페이지 보정(빈 페이지로 들어간 경우 한 칸 당김)
      if (content.length === 0 && safePage > 1) {
        console.log("[Parent] content empty → step back to", safePage - 1);
        setCurrentPage(safePage - 1);
      } else {
        // 정상 데이터면 현재 페이지를 safePage로 확정
        setCurrentPage(safePage);
      }

      // 목록 변동 시 펼침 상태 초기화(선택)
      setExpandedId(null);
    } catch (err) {
      console.error("분석 기록 조회 실패:", err);
    }
  };

  // 최초 로드
  useEffect(() => {
    isMounted.current = true;
    console.log("[Parent] mount → initial fetch");
    fetchData(1);
    return () => (isMounted.current = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 페이지/검색 변경 시 로드
  useEffect(() => {
    if (!isMounted.current) return;
    console.log(
      "[Parent] deps changed → currentPage:",
      currentPage,
      "keyword:",
      searchKeyword,
      "type:",
      searchType
    );
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchKeyword, searchType]);

  // totalPages가 줄어든 경우 보정
  useEffect(() => {
    console.log("[Parent] totalPages changed →", totalPages);
    setCurrentPage((p) => {
      const next = clamp(p, totalPages || 1);
      if (next !== p) console.log("[Parent] clamp currentPage:", p, "→", next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSearch = () => {
    console.log(
      "[Parent] handleSearch → reset to page 1 with keyword:",
      searchKeyword,
      "type:",
      searchType
    );
    setCurrentPage(1);
  };

  return (
    <div
      className="min-h-screen bg-slate-300 px-6 py-6"
      onClickCapture={(e) => {
        const t = e.target;
        console.log("[CAPTURE] clicked:", {
          tag: t.tagName,
          text: (t.innerText || "").slice(0, 30),
          classes: t.className,
          dataPagi: t.closest("[data-pagi]")?.getAttribute("data-pagi") || null, // ← 이게 찍히면 진짜 우리 컴포넌트
        });
      }}
    >
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">분석 기록</h2>

      {/* 🔍 검색창 */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
        <AdminAnalysisSearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          searchType={searchType}
          setSearchType={setSearchType}
          onSearch={handleSearch}
        />
      </div>

      {/* 📄 분석 테이블 */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <AdminAnalysisTable
          analysisList={analysisList}
          expandedId={expandedId}
          toggleExpand={toggleExpand}
        />

        {/* 📑 페이지네이션 (totalPages가 1 이상일 때만 노출) */}
        <div className="flex justify-center mt-6">
          {(() => {
            console.log(
              "[Render] Pagination check → totalPages:",
              totalPages,
              "| currentPage(1-based):",
              currentPage
            );
            const onChangeHandler = (p0) => {
              console.log(
                "[Parent] onChange called → next(0-based):",
                p0,
                "→ setCurrentPage:",
                p0 + 1
              );
              setCurrentPage(p0 + 1);
            };
            console.log(
              "[Render] onChangeHandler type:",
              typeof onChangeHandler
            );

            return totalPages > 0 ? (
              <AdminPagination
                currentPage={currentPage - 1} // 0-based
                totalPages={totalPages}
                onPageChange={(next0) => setCurrentPage(next0 + 1)}
                color="indigo"
              />
            ) : null;
          })()}
        </div>

        {/* 페이지가 아예 없을 때(=검색 결과 없음) */}
        {totalPages === 0 && (
          <div className="text-center text-slate-500 py-6">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
