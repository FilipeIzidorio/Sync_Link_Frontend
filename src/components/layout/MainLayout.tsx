import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#0a0f1f] text-white">
      <Sidebar open={open} />

      <div className="flex-1 flex flex-col">
        <Topbar toggleSidebar={() => setOpen(!open)} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* 🔥 ESSENCIAL PARA AS PÁGINAS APARECEREM */}
            <Outlet />

          </div>
        </main>
      </div>
    </div>
  );
}
