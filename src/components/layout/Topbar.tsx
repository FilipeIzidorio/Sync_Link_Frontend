import { LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../../auth/useAuthStore";

export default function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-panel border-b border-glassBorder shadow-soft">
      {/* Botão de abrir sidebar */}
      <button onClick={toggleSidebar} className="mr-4 p-2 hover:bg-white/10 rounded-lg">
        <Menu className="text-white w-6 h-6" />
      </button>

      <div>
        <h2 className="text-xl font-display">
          Bem-vindo, <span className="text-primary">{user?.nome}</span>
        </h2>
        <p className="text-xs text-slate-400">Perfil: {user?.perfil}</p>
      </div>

      {/* Botão sair */}
      <button onClick={logout} className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg flex gap-2">
        <LogOut size={16} /> Sair
      </button>
    </header>
  );
}
