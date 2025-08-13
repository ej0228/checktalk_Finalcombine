import React from "react";

export default function AdminUserRow({ user, onDelete }) {
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="px-4 py-2 border-b border-slate-100">{user.userId}</td>
      <td className="px-4 py-2 border-b border-slate-100">{user.name}</td>
      <td className="px-4 py-2 border-b border-slate-100">{user.email}</td>
      <td className="px-4 py-2 border-b border-slate-100">{user.phone}</td>
      <td className="px-4 py-2 border-b border-slate-100">{user.job}</td>
      <td className="px-4 py-2 border-b border-slate-100 text-center">
        <button
          onClick={() => onDelete(user.userId)}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded shadow-sm transition"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}
