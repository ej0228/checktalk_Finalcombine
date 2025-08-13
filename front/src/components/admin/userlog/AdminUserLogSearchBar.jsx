import React from "react";

export default function AdminUserLogSearchBar({
  searchName,
  setSearchName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
}) {
  // 엔터 키로 검색
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-start w-full">
      <input
        id="name"
        type="text"
        placeholder="이름 검색"
        value={searchName || ""}
        onChange={(e) => setSearchName(e.target.value)}
        onKeyDown={handleKeyPress}
        className="border border-slate-300 rounded px-3 py-2.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        id="start"
        type="date"
        value={startDate || ""}
        onChange={(e) => setStartDate(e.target.value)}
        onKeyDown={handleKeyPress}
        className="border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        id="end"
        type="date"
        value={endDate || ""}
        onChange={(e) => setEndDate(e.target.value)}
        onKeyDown={handleKeyPress}
        className="border border-slate-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={onSearch}
        className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
      >
        검색
      </button>
    </div>
  );
}
