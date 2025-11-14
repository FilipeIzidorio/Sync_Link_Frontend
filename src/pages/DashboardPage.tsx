// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { mesaApi } from "../api/mesaApi";
import { comandaApi } from "../api/comandaApi";
import { pedidoApi } from "../api/pedidoApi";
import { MesaResumoDTO, ComandaDTO, PedidoDTO } from "../types/dto";

export default function DashboardPage() {
  const [mesas, setMesas] = useState<MesaResumoDTO[]>([]);
  const [comandas, setComandas] = useState<ComandaDTO[]>([]);
  const [pedidosAtivos, setPedidosAtivos] = useState<PedidoDTO[]>([]);

  useEffect(() => {
    Promise.all([
      mesaApi.listarResumo(),
      comandaApi.abertas(),
      pedidoApi.ativos(),
    ]).then(([mesasRes, comandasRes, pedidosRes]) => {
      setMesas(mesasRes.data);
      setComandas(comandasRes.data);
      setPedidosAtivos(pedidosRes.data);
    });
  }, []);

  const mesasOcupadas = mesas.filter((m) => m.status === "OCUPADA").length;
  const mesasLivres = mesas.filter((m) => m.status === "LIVRE").length;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500">Mesas ocupadas</div>
          <div className="text-2xl font-semibold">{mesasOcupadas}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Mesas livres</div>
          <div className="text-2xl font-semibold">{mesasLivres}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Comandas abertas</div>
          <div className="text-2xl font-semibold">
            {comandas.filter((c) => c.status !== "FECHADA").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Pedidos ativos</div>
          <div className="text-2xl font-semibold">{pedidosAtivos.length}</div>
        </Card>
      </div>

      {/* Aqui você pode adicionar gráficos de vendas, formas de pagamento etc */}
    </div>
  );
}
