import React from "react";

export default function AdminCommunityTableRow({
  post,
  handleRestore,
  handleDelete,
}) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  };

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50 transition">
      <td className="px-4 py-2">{post.commentId}</td>
      <td className="px-4 py-2 text-slate-700">{post.authorEmail}</td>
      <td className="px-4 py-2 text-slate-700 truncate max-w-[250px]">
        {post.content}
      </td>
      <td className="px-4 py-2 text-slate-600">{formatDate(post.createdAt)}</td>
      <td className="px-4 py-2 text-slate-600">{post.reportCount}</td>
      <td className="px-4 py-2 text-red-600 truncate max-w-[200px] font-medium">
        {post.reason || "사유 없음"}
      </td>
      <td className="px-4 py-2 font-medium text-slate-700">
        {post.reportStatus === "RESOLVED" ? "✅ 처리 완료" : "⏳ 처리 대기"}
      </td>
      <td className="px-4 py-2 text-slate-700">
        {post.reportAction === "RESTORED" ? (
          <span className="text-blue-500">🔁 복구됨</span>
        ) : post.reportAction === "DELETED" ? (
          <span className="text-red-500">🗑️ 삭제됨</span>
        ) : (
          "―"
        )}
      </td>
      <td className="px-4 py-2 text-center space-x-2">
        <button
          onClick={() => handleRestore(post.commentId)}
          disabled={post.deleted}
          className={`text-sm font-medium transition ${
            post.deleted
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:underline"
          }`}
        >
          복구
        </button>
        <button
          onClick={() => handleDelete(post.commentId)}
          disabled={post.deleted}
          className={`text-sm font-medium transition ${
            post.deleted
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:underline"
          }`}
        >
          삭제
        </button>
      </td>
    </tr>
  );
}
