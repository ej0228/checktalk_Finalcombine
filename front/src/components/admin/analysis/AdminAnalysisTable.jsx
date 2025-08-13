import React from "react";
import AdminMatchingTrendRow from "@/components/admin/analysis/AdminMatchingTrendRow";
import { formatDateTime } from "@/utils/formatDateTime";

export default function AdminAnalysisTable({
  analysisList,
  expandedId,
  toggleExpand,
}) {
  return (
    <table className="min-w-full text-sm text-center text-slate-700 border border-slate-200 rounded-xl shadow-md overflow-hidden">
      <thead className="bg-slate-100 border-b border-slate-300">
        <tr>
          <th className="px-4 py-3 text-center">분석 ID</th>
          <th className="px-4 py-3 text-center">사용자</th>
          <th className="px-4 py-3 text-center">요청일</th>
          <th className="px-4 py-3 text-center">일치율</th>
          <th className="px-4 py-3 text-center">일치율 추이</th>
        </tr>
      </thead>
      <tbody>
        {analysisList.map((item) => (
          <React.Fragment key={item.id}>
            <tr className="border-t border-slate-200 hover:bg-slate-50 transition">
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.userName}</td>
              <td className="px-4 py-2">{formatDateTime(item.createdAt)}</td>
              <td className="px-4 py-2">{item.matchingRate}%</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="text-indigo-600 hover:underline text-sm"
                  onClick={() => toggleExpand(item.id)}
                >
                  {expandedId === item.id ? "접기 ▲" : "자세히 보기 ▼"}
                </button>
              </td>
            </tr>
            {expandedId === item.id && (
              <AdminMatchingTrendRow
                userId={item.userId}
                originalTextHash={item.originalTextHash}
              />
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
