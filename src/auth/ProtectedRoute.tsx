import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

interface Props {
  allowed: Array<"ADMIN" | "GERENTE" | "GARCOM" | "CAIXA" | "*">;
}

export function ProtectedRoute({ allowed }: Props) {
  const { user, loading } = useAuthStore();

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowed.includes("*")) return <Outlet />;

  if (!allowed.includes(user.perfil)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
