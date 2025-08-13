import React, { useEffect, useMemo } from "react";

export default function AdminPagination({
  page, // 0-based
  totalPages, // number
  onChange, // (nextPage: number) => void
  color = "indigo",
}) {
  const tp = Number.isFinite(totalPages) ? totalPages : 0;

  useEffect(() => {
    console.log(
      "[Pagi] render → page:",
      page,
      "tp:",
      tp,
      "onChange typeof:",
      typeof onChange
    );
  }, [page, tp, onChange]);

  if (!tp || tp <= 0) return null;

  // 스타일 계산(변수명 동일)
  const isBlue = color === "blue";
  const isIndigo = color === "indigo";
  const activeBg = isBlue
    ? "bg-blue-500"
    : isIndigo
    ? "bg-indigo-600"
    : "bg-purple-500";
  const activeText = "text-white";
  const inactiveBg = "bg-white";
  const inactiveText = isBlue
    ? "text-blue-500"
    : isIndigo
    ? "text-indigo-600"
    : "text-purple-600";
  const borderColor = "border border-slate-300";

  const clamp = (n) => Math.max(0, Math.min(Math.max(tp - 1, 0), n));

  // ✅ 명시적 핸들러(항상 함수가 되도록 고정)
  const handlePrev = useMemo(() => {
    if (typeof onChange !== "function")
      return () => console.warn("onChange not function", onChange);
    return (e) => {
      e?.preventDefault?.();
      const next = clamp(page - 1);
      if (next === page) return;
      console.log("[Pagi] handlePrev →", next);
      onChange(next);
    };
  }, [page, tp, onChange]);

  const handleNext = useMemo(() => {
    if (typeof onChange !== "function")
      return () => console.warn("onChange not function", onChange);
    return (e) => {
      e?.preventDefault?.();
      const next = clamp(page + 1);
      if (next === page) return;
      console.log("[Pagi] handleNext →", next);
      onChange(next);
    };
  }, [page, tp, onChange]);

  const handleNum = useMemo(() => {
    if (typeof onChange !== "function")
      return () => console.warn("onChange not function", onChange);
    return (idx) => (e) => {
      e?.preventDefault?.();
      const next = clamp(idx);
      if (next === page) return;
      console.log("[Pagi] handleNum →", next);
      onChange(next);
    };
  }, [page, tp, onChange]);

  return (
    <div
      className="flex justify-center items-center gap-2 mt-6 text-sm"
      data-pagi="AdminPagination@analysis" // ← 식별자
    >
      <button
        type="button"
        className={`px-4 py-2 rounded-md shadow-sm ${borderColor} ${
          page === 0
            ? "text-slate-400 bg-slate-100 cursor-not-allowed"
            : `${inactiveBg} ${inactiveText} hover:bg-slate-50 transition`
        }`}
        disabled={page === 0}
        onClick={handlePrev} // ← 항상 함수
      >
        이전
      </button>

      {[...Array(tp)].map((_, idx) => (
        <button
          type="button"
          key={idx}
          onClick={handleNum(idx)} // ← 항상 함수
          className={`px-3 py-2 rounded-md shadow-sm font-medium ${borderColor} ${
            page === idx
              ? `${activeBg} ${activeText}`
              : `${inactiveBg} ${inactiveText} hover:bg-slate-50 transition`
          }`}
        >
          {idx + 1}
        </button>
      ))}

      <button
        type="button"
        className={`px-4 py-2 rounded-md shadow-sm ${borderColor} ${
          page + 1 === tp
            ? "text-slate-400 bg-slate-100 cursor-not-allowed"
            : `${inactiveBg} ${inactiveText} hover:bg-slate-50 transition`
        }`}
        disabled={page + 1 === tp}
        onClick={handleNext} // ← 항상 함수
      >
        다음
      </button>
    </div>
  );
}
