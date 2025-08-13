import React from "react";

export default function AdminLogRow({
  log,
  getTypeLabel,
  getTypeBadgeClass,
  formatDate,
}) {
  return (
    <tr className="border-t border-slate-200">
      <td className="px-4 py-2 text-slate-700 text-center">{log.id}</td>
      <td className="px-4 py-2 text-center">
        <span
          className={`inline-block px-2 py-1 rounded  text-xs font-medium ${getTypeBadgeClass(
            log.type
          )}`}
        >
          {getTypeLabel(log.type)}
        </span>
      </td>
      <td className="px-4 py-2 text-slate-700 text-center">{log.user}</td>
      <td className="px-4 py-2 text-slate-600 text-center">
        {formatDate(log.timestamp)}
      </td>
    </tr>
  );
}
