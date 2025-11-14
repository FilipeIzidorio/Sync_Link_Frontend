/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { relatorioApi } from "../api/relatorioApi";
import { FormaPagamento } from "../types/dto";

import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";

interface EstatisticaPedidos {
  totalPedidos: number;
  pedidosEntregues: number;
  pedidosCancelados: number;
}

export default function RelatoriosPage() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [forma, setForma] = useState<FormaPagamento>("DINHEIRO");

  const [estatisticas, setEstatisticas] = useState<EstatisticaPedidos | null>(
    null
  );
  const [totalPeriodo, setTotalPeriodo] = useState(0);
  const [totalPorForma, setTotalPorForma] = useState(0);

  async function gerar() {
    if (!inicio || !fim) return alert("Informe o período.");

    const est = await relatorioApi.estatisticasPedidos(inicio, fim);
    const total = await relatorioApi.totalPeriodo(inicio, fim);
    const formaPago = await relatorioApi.porForma(forma, inicio, fim);

    setEstatisticas(est.data);
    setTotalPeriodo(total.data);
    setTotalPorForma(formaPago.data);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Relatórios</h2>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <Input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            label="Início"
          />

          <Input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            label="Fim"
          />

          <Select
            value={forma}
            onChange={(e) =>
              setForma(e.target.value as FormaPagamento)
            }
            label="Forma"
          >
            <option value="DINHEIRO">Dinheiro</option>
            <option value="PIX">PIX</option>
            <option value="CARTAO_CREDITO">Crédito</option>
            <option value="CARTAO_DEBITO">Débito</option>
          </Select>

          <Button onClick={gerar}>Gerar</Button>
        </div>
      </Card>

      {estatisticas && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-blue-50">
            <h3 className="text-sm text-blue-800 font-medium">Total Pedidos</h3>
            <div className="text-2xl font-bold">{estatisticas.totalPedidos}</div>
          </Card>

          <Card className="p-4 bg-green-50">
            <h3 className="text-sm text-green-800 font-medium">Pedidos Entregues</h3>
            <div className="text-2xl font-bold">{estatisticas.pedidosEntregues}</div>
          </Card>

          <Card className="p-4 bg-red-50">
            <h3 className="text-sm text-red-800 font-medium">Cancelados</h3>
            <div className="text-2xl font-bold">{estatisticas.pedidosCancelados}</div>
          </Card>

          <Card className="p-4 bg-slate-50 col-span-3">
            <h3 className="text-sm text-slate-700 font-medium">Total do Período</h3>
            <div className="text-2xl font-bold">R$ {totalPeriodo.toFixed(2)}</div>
          </Card>

          <Card className="p-4 bg-yellow-50 col-span-3">
            <h3 className="text-sm text-yellow-700 font-medium">
              Total por Forma ({forma})
            </h3>
            <div className="text-2xl font-bold">R$ {totalPorForma.toFixed(2)}</div>
          </Card>
        </div>
      )}
    </div>
  );
}
