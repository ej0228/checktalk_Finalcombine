import React from "react";

export default function AdminSupportTableRow({ item, goToDetail }) {
  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50 transition">
      <td className="px-4 py-3 text-slate-700 text-center">{item.postId}</td>
      <td className="px-4 py-3 text-slate-700 text-center">
        {item.writerEmail}
      </td>
      <td className="px-4 py-3 text-slate-700 text-center">{item.title}</td>
      <td className="px-4 py-3 text-slate-700 text-center">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-center font-medium">
        {item.status === "처리완료" ? (
          <span className="text-green-600">✅ 완료</span>
        ) : (
          <span className="text-red-500">❌ 미답변</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => goToDetail(item.postId)}
          className="text-indigo-600 hover:underline hover:text-indigo-800 transition font-medium"
        >
          {item.status === "처리완료" ? "답변 수정" : "답변 작성"}
        </button>
      </td>
    </tr>
  );
}
