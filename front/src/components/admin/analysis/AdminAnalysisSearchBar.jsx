import React from "react";

export default function AdminAnalysisSearchBar({
  searchKeyword,
  setSearchKeyword,
  searchType,
  setSearchType,
  onSearch,
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="border border-slate-300 rounded px-3 py-1 bg-white"
      >
        <option value="user">사용자명</option>
      </select>

      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="검색어 입력"
        className="border border-slate-300 rounded px-3 py-1 bg-white w-64"
      />

      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded transition"
        onClick={onSearch}
      >
        검색
      </button>
    </div>
  );
}
