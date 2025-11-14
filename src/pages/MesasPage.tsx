/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { mesaApi } from "../api/mesaApi";
import { comandaApi } from "../api/comandaApi";
import { MesaResumoDTO } from "../types/dto";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

import { useAuthStore } from "../auth/useAuthStore";

export default function MesasPage() {
  const [mesas, setMesas] = useState<MesaResumoDTO[]>([]);

  // 👇 Zustand
  const isAllowed = useAuthStore((s) => s.isAllowed);

  async function carregar() {
    const { data } = await mesaApi.listarResumo();
    setMesas(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function abrirComanda(mesa: MesaResumoDTO) {
    if (!confirm(`Abrir comanda na mesa ${mesa.numero}?`)) return;
    await comandaApi.abrirParaMesa(mesa.id);
    carregar();
  }

  function getStatusColor(status: MesaResumoDTO["status"]) {
    switch (status) {
      case "LIVRE":
        return "bg-emerald-100 text-emerald-700";
      case "OCUPADA":
        return "bg-amber-100 text-amber-700";
      case "RESERVADA":
        return "bg-blue-100 text-blue-700";
      case "FECHADA":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Mesas</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {mesas.map((mesa) => (
          <Card key={mesa.id} className="p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Mesa {mesa.numero}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${getStatusColor(
                  mesa.status
                )}`}
              >
                {mesa.status}
              </span>
            </div>

            {mesa.status === "LIVRE" &&
              isAllowed(["GARCOM", "GERENTE", "ADMIN"]) && (
                <Button size="sm" onClick={() => abrirComanda(mesa)}>
                  Abrir comanda
                </Button>
              )}
          </Card>
        ))}
      </div>
    </div>
  );
}
