import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

import MesasPage from "../pages/MesasPage";
import ComandasPage from "../pages/ComandasPage";
import PedidosPage from "../pages/PedidosPage";
import CaixaPage from "../pages/CaixaPage";
import UsuariosPage from "../pages/UsuariosPage";
import EstoquePage from "../pages/EstoquePage";
import ProdutosPage from "../pages/ProdutosPage";
import CategoriasPage from "../pages/CategoriasPage";
import RelatoriosPage from "../pages/RelatoriosPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PÚBLICO */}
        <Route path="/login" element={<LoginPage />} />

        {/* PRIVADO */}
        <Route element={<ProtectedRoute allowed={["*"]} />}>
          <Route element={<MainLayout />}>

            <Route path="/" element={<DashboardPage />} />

            <Route path="/mesas" element={<MesasPage />} />
            <Route path="/comandas" element={<ComandasPage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="/caixa" element={<CaixaPage />} />

            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/estoque" element={<EstoquePage />} />

            <Route
              path="/usuarios"
              element={<ProtectedRoute allowed={["ADMIN"]} />}
            >
              <Route index element={<UsuariosPage />} />
            </Route>

            <Route path="/relatorios" element={<RelatoriosPage />} />

          </Route>
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
