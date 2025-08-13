import React from "react";

export default function AdminCommunityFilterBar({
  filterStatus,
  setFilterStatus,
  setPage,
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="filter" className="font-medium text-slate-700">
        처리 상태:
      </label>

      <select
        id="filter"
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setPage(0); // 필터 변경 시 페이지 초기화
        }}
        className="border border-slate-300 rounded px-3 py-1 bg-white"
      >
        <option value="">전체</option>
        <option value="PENDING">처리 대기</option>
        <option value="RESOLVED">처리 완료</option>
      </select>
    </div>
  );
}
