// src/routes/AdminLayout.jsx

import AdminHeader from "@/components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-300 flex flex-col">
      <AdminHeader />
      <main className="flex-grow w-full bg-slate-300">
        <Outlet />
      </main>
    </div>
  );
}
