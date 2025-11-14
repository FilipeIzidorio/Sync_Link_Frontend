import { useEffect, useState } from "react";
import { comandaApi } from "../api/comandaApi";
import { pedidoApi } from "../api/pedidoApi";
import { pagamentoApi } from "../api/pagamentoApi";

import {
  ComandaDTO,
  PedidoDTO,
  PagamentoDTO,
  FormaPagamento,
} from "../types/dto";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { DataTable, Column } from "../components/common/DataTable";

export default function CaixaPage() {
  const [comandas, setComandas] = useState<ComandaDTO[]>([]);
  const [selecionada, setSelecionada] = useState<ComandaDTO | null>(null);
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [pagamentos, setPagamentos] = useState<PagamentoDTO[]>([]);
  const [valorPagamento, setValorPagamento] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("DINHEIRO");

  const [, setLoading] = useState(false);

  async function carregarComandas() {
    const res = await comandaApi.abertas();
    setComandas(res.data);
  }

  useEffect(() => {
    carregarComandas();
  }, []);

  async function selecionarComanda(c: ComandaDTO) {
    setSelecionada(c);

    const pedidosResp = await pedidoApi.porMesa(c.mesaId);
    setPedidos(pedidosResp.data);

    const lista: PagamentoDTO[] = [];
    for (const ped of pedidosResp.data) {
      const resp = await pagamentoApi.porPedido(ped.id);
      lista.push(...resp.data);
    }
    setPagamentos(lista);
  }

  const totalItens = pedidos.reduce((acc, p) => acc + p.total, 0);
  const totalPago = pagamentos.reduce(
    (acc, pg) => (["PAGO", "PARCIAL"].includes(pg.status) ? acc + pg.valor : acc),
    0
  );
  const saldo = totalItens - totalPago;

  async function pagarParcial() {
    if (!selecionada) return;

    if (valorPagamento <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    setLoading(true);
    try {
      await pagamentoApi.processarPagamento(
        selecionada.id,
        formaPagamento,
        valorPagamento
      );

      alert("Pagamento registrado");
      selecionarComanda(selecionada);
    } finally {
      setLoading(false);
    }
  }

  async function pagarTotal() {
    if (!selecionada) return;

    setLoading(true);
    try {
      await pagamentoApi.processarPagamentoCompleto(selecionada.id, {
        formaPagamento,
        valor: saldo,
        id: 0,
        pedidoId: 0,
        status: "PENDENTE",
        dataHora: ""
      });

      alert("Pagamento concluído");
      selecionarComanda(selecionada);
    } finally {
      setLoading(false);
    }
  }

  async function fecharComanda() {
    if (!selecionada) return;

    if (saldo !== 0) {
      alert("Ainda há saldo pendente.");
      return;
    }

    await comandaApi.fechar(selecionada.id);

    alert("Comanda fechada!");
    carregarComandas();
    setSelecionada(null);
  }

  const colPagamentos: Column<PagamentoDTO>[] = [
    { header: "ID", accessor: "id" },
    { header: "Forma", accessor: "formaPagamento" },
    { header: "Valor", render: (p) => `R$ ${p.valor.toFixed(2)}` },
    { header: "Status", accessor: "status" },
  ];

  const colPedidos: Column<PedidoDTO>[] = [
    { header: "ID", accessor: "id" },
    { header: "Status", accessor: "status" },
    { header: "Total", render: (p) => `R$ ${p.total.toFixed(2)}` },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Caixa</h2>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-3 col-span-1">
          <h3 className="font-medium mb-2 text-sm">Comandas Abertas</h3>
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {comandas.map((c) => (
              <button
                key={c.id}
                onClick={() => selecionarComanda(c)}
                className={`p-2 rounded border text-left ${
                  selecionada?.id === c.id ? "border-blue-500 bg-blue-50" : "border-slate-200"
                }`}
              >
                <div className="font-semibold text-sm">Comanda {c.codigo}</div>
                <div className="text-xs text-slate-500">Mesa {c.mesaNumero}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-3 col-span-2 space-y-4">
          {selecionada ? (
            <>
              <h3 className="font-semibold text-sm">
                Detalhes da Comanda {selecionada.codigo}
              </h3>

              <DataTable data={pedidos} columns={colPedidos} keyField="id" />

              <DataTable data={pagamentos} columns={colPagamentos} keyField="id" />

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-slate-100 rounded">
                  <div className="text-xs text-slate-500">Total itens</div>
                  <div className="font-semibold">R$ {totalItens.toFixed(2)}</div>
                </div>

                <div className="p-2 bg-slate-100 rounded">
                  <div className="text-xs text-slate-500">Total pago</div>
                  <div className="font-semibold">R$ {totalPago.toFixed(2)}</div>
                </div>

                <div className="p-2 bg-yellow-100 rounded">
                  <div className="text-xs text-yellow-700">Saldo pendente</div>
                  <div className="font-semibold text-yellow-700">
                    R$ {saldo.toFixed(2)}
                  </div>
                </div>
              </div>

              {saldo > 0 && (
                <Card className="p-3 space-y-3 border border-slate-200">
                  <h4 className="font-medium text-sm">Registrar Pagamento</h4>

                  <div className="grid grid-cols-3 gap-3 text-sm">

                    {/* Valor */}
                    <div className="flex flex-col">
                      <label className="text-xs mb-1">Valor</label>
                      <Input
                        type="number"
                        value={valorPagamento}
                        onChange={(e) => setValorPagamento(Number(e.target.value))}
                      />
                    </div>

                    {/* Forma */}
                    <div className="flex flex-col">
                      <label className="text-xs mb-1">Forma</label>
                      <Select
                        value={formaPagamento}
                        onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                      >
                        <option value="DINHEIRO">Dinheiro</option>
                        <option value="PIX">PIX</option>
                        <option value="CARTAO_CREDITO">Crédito</option>
                        <option value="CARTAO_DEBITO">Débito</option>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button onClick={pagarParcial}>Pagar Parcial</Button>
                    </div>
                  </div>

                  <Button onClick={pagarTotal} className="w-full">
                    Pagar Total (R$ {saldo.toFixed(2)})
                  </Button>
                </Card>
              )}

              {saldo === 0 && (
                <Button className="w-full" onClick={fecharComanda}>
                  Fechar Comanda
                </Button>
              )}
            </>
          ) : (
            <div className="text-sm text-slate-500">Selecione uma comanda.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
