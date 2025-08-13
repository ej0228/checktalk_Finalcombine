// App_dev.jsx
import { useState } from "react";
import AdminPagination from "@/components/AdminPagination";

export default function App() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(5);

  return (
    <div className="p-6 space-y-4">
      <div>
        page: {page} / total: {totalPages}
      </div>
      <input
        type="number"
        value={totalPages}
        min={0}
        onChange={(e) => setTotalPages(Number(e.target.value || 0))}
        className="border p-1 rounded"
      />
      <AdminPagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
