import React from "react";

export default function AdminSupportFilterBar({
  statusFilter,
  setStatusFilter,
  setPage,
}) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="statusFilter"
        className="text-sm font-medium text-slate-700"
      >
        답변 상태:
      </label>
      <select
        id="statusFilter"
        value={statusFilter}
        onChange={(e) => {
          setPage(0); // 필터 변경 시 페이지 초기화
          setStatusFilter(e.target.value);
        }}
        className="border border-slate-300 bg-white rounded px-3 py-1 text-sm text-slate-700 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="전체">전체</option>
        <option value="처리완료">완료</option>
        <option value="미답변">미답변</option>
      </select>
    </div>
  );
}
