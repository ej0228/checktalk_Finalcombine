import React from "react";

export default function AdminUserSearchBar({
  searchType,
  setSearchType,
  keyword,
  setKeyword,
  onSearch,
  onReset,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <div className="flex items-center gap-2 text-sm">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-slate-300 rounded px-3 py-1 bg-white"
        >
          <option value="name">이름</option>
          <option value="email">이메일</option>
        </select>

        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          className="border border-slate-300 rounded px-3 py-1 bg-white w-64"
        />

        <button
          onClick={onSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded transition"
        >
          검색
        </button>
        <button
          onClick={onReset}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-1.5 rounded transition"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
