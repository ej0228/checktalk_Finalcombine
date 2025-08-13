export default function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const tp = Number.isFinite(totalPages) ? totalPages : 0;
  if (tp <= 0) return null;

  const p0 = Number.isFinite(currentPage) ? currentPage : 0;
  const clamp = (n) => Math.max(0, Math.min(tp - 1, n));
  const go = (n) => {
    const next = clamp(n);
    if (next === p0) return;
    if (typeof onPageChange !== "function") {
      console.warn(
        "AdminPagination: onPageChange is not a function:",
        onPageChange
      );
      return;
    }
    onPageChange(next);
  };

  const pageGroupSize = 5;
  const currentGroup = Math.floor(p0 / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize - 1, tp - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex justify-center gap-1">
      <button
        type="button"
        onClick={() => go(startPage - 1)}
        disabled={startPage === 0}
        className={`px-3 py-1 rounded border text-sm transition ${
          startPage === 0
            ? "text-slate-400 border-slate-200 bg-white cursor-not-allowed"
            : "text-slate-700 border-slate-300 hover:bg-slate-100"
        }`}
      >
        이전
      </button>

      {pages.map((pageNum) => (
        <button
          type="button"
          key={pageNum}
          onClick={() => go(pageNum)}
          className={`w-8 h-8 text-sm rounded border transition font-medium ${
            p0 === pageNum
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-indigo-600 border-slate-300 hover:bg-indigo-50"
          }`}
        >
          {pageNum + 1} {/* 표시만 1-based */}
        </button>
      ))}

      <button
        type="button"
        onClick={() => go(endPage + 1)}
        disabled={endPage + 1 >= tp}
        className={`px-3 py-1 rounded border text-sm transition ${
          endPage + 1 >= tp
            ? "text-slate-400 border-slate-200 bg-white cursor-not-allowed"
            : "text-slate-700 border-slate-300 hover:bg-slate-100"
        }`}
      >
        다음
      </button>
    </div>
  );
}
