import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import { formatDateTime } from "@/utils/formatDateTime";

export default function AdminMatchingTrendRow({ userId, originalTextHash }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get("/admin/analysis/history", {
      params: { userId, originalTextHash },
    })
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.error("❌ 추이 데이터 조회 실패:", err);
        setHistory([]);
      });
  }, [userId, originalTextHash]);

  const getChange = (curr, prev) => {
    if (prev == null) return "-";
    const diff = curr - prev;
    const color =
      diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";
    const symbol = diff > 0 ? "🟢 +" : diff < 0 ? "🔴 " : "⚪ ";
    return (
      <span className={color}>
        {symbol}
        {Math.abs(diff).toFixed(2)}%
      </span>
    );
  };

  const totalChange =
    history.length >= 2
      ? (
          history[history.length - 1].matchingRate - history[0].matchingRate
        ).toFixed(2)
      : "0.00";

  if (history.length === 0) {
    return (
      <tr>
        <td
          colSpan="5"
          className="px-4 py-3 text-center text-center text-slate-500 bg-slate-50"
        >
          📭 분석 추이 기록이 없습니다.
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan="5" className="bg-slate-50 px-4 py-5">
        <div className="text-sm text-slate-700">
          <p className="font-semibold mb-3 text-left">📊 분석 추이 보기</p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4">
            <table className="w-full text-sm text-center text-slate-700">
              <thead className="bg-slate-100  text-slate-800">
                <tr>
                  <th className="px-3 py-2 text-center">Version</th>
                  <th className="px-3 py-2 text-center">일치율</th>
                  <th className="px-3 py-2 text-center">분석일</th>
                  <th className="px-3 py-2 text-center">변화</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, idx) => (
                  <tr
                    key={h.versionNo}
                    className="border-t border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-3 py-2">{h.versionNo}</td>
                    <td className="px-3 py-2">
                      {Number(h.matchingRate).toFixed(2)}%
                    </td>
                    <td className="px-3 py-2">{formatDateTime(h.createdAt)}</td>
                    <td className="px-3 py-2">
                      {getChange(
                        Number(h.matchingRate),
                        history[idx - 1]?.matchingRate
                          ? Number(history[idx - 1].matchingRate)
                          : null
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-600">
            📈 총 향상도:{" "}
            <strong className="text-slate-800">
              {totalChange >= 0 ? `+${totalChange}%` : `${totalChange}%`}
            </strong>{" "}
            {totalChange > 0 && (
              <span className="text-green-600 ml-2">🟢 이해도 향상됨 ✅</span>
            )}
            {totalChange < 0 && (
              <span className="text-red-600 ml-2">🔴 이해도 저하됨 ⚠️</span>
            )}
            {totalChange === "0.00" && (
              <span className="text-gray-500 ml-2">⚪ 변화 없음</span>
            )}
          </p>
        </div>
      </td>
    </tr>
  );
}
