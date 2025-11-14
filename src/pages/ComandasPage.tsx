/* eslint-disable react-hooks/set-state-in-effect */
// src/pages/ComandasPage.tsx
import { useEffect, useState } from "react";
import { comandaApi } from "../api/comandaApi";
import { ComandaDTO } from "../types/dto";
import { DataTable, Column } from "../components/common/DataTable";
import { Button } from "../components/ui/Button";

import { useAuthStore } from "../auth/useAuthStore";

export default function ComandasPage() {
  const [comandas, setComandas] = useState<ComandaDTO[]>([]);
  
  // Zustand 👇
  const isAllowed = useAuthStore((s) => s.isAllowed);

  async function carregar() {
    const { data } = await comandaApi.abertas();
    setComandas(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function fechar(comanda: ComandaDTO) {
    if (!confirm(`Fechar comanda ${comanda.codigo}?`)) return;
    await comandaApi.fechar(comanda.id);
    carregar();
  }

  async function cancelar(comanda: ComandaDTO) {
    const motivo = prompt(`Motivo do cancelamento da comanda ${comanda.codigo}:`);
    if (!motivo) return;
    await comandaApi.cancelar(comanda.id, motivo);
    carregar();
  }

  const columns: Column<ComandaDTO>[] = [
    { header: "Código", accessor: "codigo" },
    { header: "Mesa", accessor: "mesaNumero" },
    { header: "Cliente", accessor: "cliente" },
    { header: "Status", accessor: "status" },

    {
      header: "Total",
      render: (c) => `R$ ${c.total.toFixed(2)}`,
    },

    {
      header: "Ações",
      render: (c) => (
        <div className="flex gap-2 justify-end">
          
          {/* CAIXA, GERENTE e ADMIN podem FECHAR */}
          {isAllowed(["CAIXA", "GERENTE", "ADMIN"]) && (
            <Button size="sm" onClick={() => fechar(c)}>
              Fechar
            </Button>
          )}

          {/* Só GERENTE e ADMIN podem CANCELAR */}
          {isAllowed(["GERENTE", "ADMIN"]) && (
            <Button size="sm" variant="danger" onClick={() => cancelar(c)}>
              Cancelar
            </Button>
          )}

        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Comandas Abertas</h2>

      <DataTable
        data={comandas}
        columns={columns}
        keyField="id"
        emptyMessage="Nenhuma comanda aberta."
      />
    </div>
  );
}
