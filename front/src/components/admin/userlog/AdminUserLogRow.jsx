import React from "react";

export default function AdminUserLogRow({ log, index }) {
  if (!log) return null;

  const formattedTime = log.actionTime
    ? new Date(log.actionTime).toLocaleString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
    : "날짜 없음";

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-100 transition-colors">
      <td className="px-4 py-3 text-center text-slate-600">{index}</td>
      <td className="px-4 py-3 text-center font-medium text-slate-800">
        {log.userName}
      </td>
      <td className="px-4 py-3 text-center text-slate-600">{log.ipAddress}</td>
      <td className="px-4 py-3 text-center text-slate-600 whitespace-nowrap">
        {formattedTime}
      </td>
    </tr>
  );
}
