import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  ClipboardList,
  FileChartColumn,
  Package,
  Users,
  Boxes,
} from "lucide-react";

import { useAuthStore } from "../../auth/useAuthStore";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const { user } = useAuthStore();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Mesas", icon: Coffee, to: "/mesas", roles: ["GARCOM", "GERENTE", "ADMIN"] },
    { label: "Comandas", icon: ClipboardList, to: "/comandas", roles: ["GARCOM", "GERENTE", "ADMIN"] },
    { label: "Pedidos", icon: ClipboardList, to: "/pedidos", roles: ["GARCOM", "GERENTE", "ADMIN", "CAIXA"] },
    { label: "Caixa", icon: FileChartColumn, to: "/caixa", roles: ["CAIXA", "GERENTE", "ADMIN"] },
    { label: "Produtos", icon: Package, to: "/produtos", roles: ["GERENTE", "ADMIN"] },
    { label: "Categorias", icon: Boxes, to: "/categorias", roles: ["GERENTE", "ADMIN"] },
    { label: "Estoque", icon: Boxes, to: "/estoque", roles: ["GERENTE", "ADMIN"] },
    { label: "Usuários", icon: Users, to: "/usuarios", roles: ["ADMIN"] },
    { label: "Relatórios", icon: FileChartColumn, to: "/relatorios", roles: ["GERENTE", "ADMIN"] },
  ];

  return (
    <aside
      className={`
        h-screen bg-[#0d1326] border-r border-white/10
        transition-all duration-300 ease-in-out
        ${open ? "w-56" : "w-0 overflow-hidden border-none"}
      `}
    >
      {open && (
        <div className="flex flex-col h-full relative">

          {/* Header */}
          <div className="flex items-center px-4 py-5 border-b border-white/10">
            <span className="font-bold text-lg text-primary tracking-wide">
              Painel Sync Link
            </span>
          </div>

          {/* Menu */}
          <nav className="mt-4 flex flex-col gap-1 px-2">
            {menu
              .filter((m) => !m.roles || m.roles.includes(user?.perfil ?? ""))
              .map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-3 
                      px-4 py-3 
                      text-sm font-medium
                      rounded-lg
                      transition-all duration-200

                      ${
                        isActive
                          ? "bg-primary/20 text-primary shadow-sm"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }
                      `
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
          </nav>

        </div>
      )}
    </aside>
  );
}
