/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { mesaApi } from "../api/mesaApi";
import { comandaApi } from "../api/comandaApi";
import { pedidoApi } from "../api/pedidoApi";
import { produtoApi } from "../api/produtoApi";

import {
  MesaDTO,
  ComandaDTO,
  PedidoDTO,
  ItemPedidoDTO,
  ProdutoDTO,
} from "../types/dto";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { DataTable, Column } from "../components/common/DataTable";

export default function PedidosPage() {
  const [mesas, setMesas] = useState<MesaDTO[]>([]);
  const [mesaSelecionada, setMesaSelecionada] = useState<MesaDTO | null>(null);
  const [comanda, setComanda] = useState<ComandaDTO | null>(null);
  const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);

  const [produtoId, setProdutoId] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacao, setObservacao] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    mesaApi.listar().then((r) => setMesas(r.data));
    produtoApi.listarAtivos().then((r) => setProdutos(r.data));
  }, []);

  async function selecionarMesa(m: MesaDTO) {
    setMesaSelecionada(m);

    try {
      const resp = await comandaApi.porMesa(m.id);
      const lista = resp.data;

      const comandaAtual = lista.length > 0 ? lista[0] : null;
      setComanda(comandaAtual);

      const pedidosResp = await pedidoApi.porMesa(m.id);
      setPedidos(pedidosResp.data);
    } catch {
      setComanda(null);
      setPedidos([]);
    }
  }

  async function abrirComanda() {
    if (!mesaSelecionada) return alert("Selecione uma mesa");

    const resp = await comandaApi.abrirParaMesa(mesaSelecionada.id);
    setComanda(resp.data);
    selecionarMesa(mesaSelecionada);
  }

  async function criarPedido() {
    if (!comanda) return alert("Abra a comanda primeiro!");

    const resp = await pedidoApi.criar({ comandaId: comanda.id });
    setPedidos((prev) => [...prev, resp.data]);
  }

  async function adicionarItem(pedido: PedidoDTO) {
    if (!produtoId || quantidade <= 0) {
      alert("Selecione produto e quantidade.");
      return;
    }

    const resp = await pedidoApi.adicionarItem(pedido.id, {
      produtoId,
      quantidade,
      observacao,
    });

    atualizarPedidoLista(resp.data);
    setQuantidade(1);
    setObservacao("");
  }

  function removerItem(pedidoId: number, itemId: number) {
    setConfirmMessage("Deseja remover este item?");
    setConfirmAction(() => async () => {
      const resp = await pedidoApi.removerItem(pedidoId, itemId);
      atualizarPedidoLista(resp.data);
    });
    setConfirmOpen(true);
  }

  async function alterarQtd(pedidoId: number, itemId: number, qtd: number) {
    const resp = await pedidoApi.atualizarQuantidade(pedidoId, itemId, qtd);
    atualizarPedidoLista(resp.data);
  }

  function cancelarPedido(pedidoId: number) {
    setConfirmMessage("Confirmar cancelamento do pedido?");
    setConfirmAction(() => async () => {
      const motivo = prompt("Motivo do cancelamento:") || "Sem motivo";
      const resp = await pedidoApi.cancelar(pedidoId, motivo);
      atualizarPedidoLista(resp.data);
    });
    setConfirmOpen(true);
  }

  async function entregarPedido(pedido: PedidoDTO) {
    const resp = await pedidoApi.atualizarStatus(pedido.id, "ENTREGUE");
    atualizarPedidoLista(resp.data);
  }

  function atualizarPedidoLista(att: PedidoDTO) {
    setPedidos((prev) => prev.map((p) => (p.id === att.id ? att : p)));
  }

  const colPedidos: Column<PedidoDTO>[] = [
    { header: "ID", accessor: "id" },
    { header: "Status", accessor: "status" },
    { header: "Total", render: (p) => `R$ ${p.total.toFixed(2)}` },
    {
      header: "Ações",
      render: (p) => (
        <div className="flex gap-2">
          {p.status === "PENDENTE" && (
            <Button variant="outline" onClick={() => entregarPedido(p)}>
              Entregar
            </Button>
          )}
          <Button variant="danger" onClick={() => cancelarPedido(p.id)}>
            Cancelar
          </Button>
        </div>
      ),
    },
  ];

  const colItens: Column<ItemPedidoDTO>[] = [
    { header: "Produto", accessor: "produtoNome" },
    { header: "Qtd", accessor: "quantidade" },
    { header: "Total", render: (i) => `R$ ${i.total.toFixed(2)}` },
    {
      header: "Ações",
      render: (i) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              alterarQtd(
                comanda!.id,
                i.id,
                i.quantidade + 1
              )
            }
          >
            +
          </Button>

          {i.quantidade > 1 && (
            <Button
              variant="outline"
              onClick={() =>
                alterarQtd(
                  comanda!.id,
                  i.id,
                  i.quantidade - 1
                )
              }
            >
              -
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() => removerItem(comanda!.id, i.id)}
          >
            Remover
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Pedidos</h2>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-3">
          <h3 className="text-sm font-semibold mb-3">Mesas</h3>

          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {mesas.map((m) => (
              <Button
                key={m.id}
                variant={mesaSelecionada?.id === m.id ? "primary" : "outline"}
                onClick={() => selecionarMesa(m)}
                className="justify-start"
              >
                Mesa {m.numero} — {m.status}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-3 col-span-2 space-y-4">
          {mesaSelecionada ? (
            <>
              <h3 className="font-semibold text-sm">
                Mesa {mesaSelecionada.numero}
              </h3>

              {!comanda ? (
                <Button onClick={abrirComanda}>Abrir Comanda</Button>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">
                      Comanda {comanda.codigo}
                    </h4>

                    <Button onClick={criarPedido}>Novo Pedido</Button>
                  </div>

                  <DataTable data={pedidos} columns={colPedidos} keyField="id" />

                  {pedidos.map((p) => (
                    <Card key={p.id} className="p-3 border">
                      <h4 className="font-semibold text-sm mb-2">
                        Pedido {p.id}
                      </h4>

                      <DataTable
                        data={p.itens}
                        columns={colItens}
                        keyField="id"
                      />

                      {p.status === "PENDENTE" && (
                        <div className="grid grid-cols-4 gap-3 mt-3">
                          <Select
                            value={produtoId}
                            onChange={(e) => setProdutoId(Number(e.target.value))}
                          >
                            <option value={0}>Selecione...</option>
                            {produtos.map((prod) => (
                              <option key={prod.id} value={prod.id}>
                                {prod.nome} — R${prod.preco}
                              </option>
                            ))}
                          </Select>

                          <Input
                            type="number"
                            min={1}
                            value={quantidade}
                            onChange={(e) =>
                              setQuantidade(Number(e.target.value))
                            }
                          />

                          <Input
                            placeholder="Observação"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                          />

                          <Button onClick={() => adicionarItem(p)}>
                            Adicionar
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="text-sm text-slate-500">
              Selecione uma mesa para visualizar pedidos.
            </div>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmação"
        message={confirmMessage}
        onConfirm={() => {
          confirmAction();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
