// 1. DevPagination 테스트 컴포넌트 임시 생성
import React, { useState } from "react";
import AdminPagination from "@/components/AdminPagination";

function DevPaginationPage() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(5);

  return (
    <div className="p-6 space-y-4">
      <div>
        현재 page: {page} / 총 페이지: {totalPages}
      </div>
      <input
        type="number"
        value={totalPages}
        onChange={(e) => setTotalPages(Number(e.target.value))}
        className="border p-1 rounded"
      />
      <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
