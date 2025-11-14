/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import  api from "../api/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/common/Badge";
import { toast } from "../components/ui/toast";

interface Comanda {
  id: number;
  codigo: string;
  cliente?: string;
  mesa: { id: number; numero: number };
  status: string;
  total?: number;
  desconto?: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface PedidoItem {
  id: number;
  produto: Produto;
  quantidade: number;
  observacao?: string;
}

interface Pedido {
  id: number;
  status: "PENDENTE" | "ENTREGUE" | "CANCELADO";
  itens: PedidoItem[];
  criadoEm: string;
}

export default function ComandaDetalhePage() {
  const { id } = useParams();
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalNovoItem, setModalNovoItem] = useState(false);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [observacao, setObservacao] = useState("");

  const [modalPagamento, setModalPagamento] = useState(false);
  const [valorPago, setValorPago] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("PIX");

  async function carregar() {
    setLoading(true);
    try {
      const [res1, res2, res3] = await Promise.all([
        api.get(`/api/comandas/${id}`),
        api.get(`/api/pedidos/comanda/${id}`),
        api.get("/api/produtos/ativos"),
      ]);

      setComanda(res1.data);
      setPedidos(res2.data);
      setProdutos(res3.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function adicionarItem() {
    try {
      const { data: pedido } = await api.post("/api/pedidos", {
        comandaId: comanda?.id,
      });

      await api.post(`/api/pedidos/${pedido.id}/itens`, {
        produtoId: Number(produtoId),
        quantidade: Number(quantidade),
        observacao,
      });

      toast.show("Item adicionado.");
      setModalNovoItem(false);
      carregar();
    } catch {
      toast.show("Erro ao adicionar item.");
    }
  }

  async function entregarPedido(p: Pedido) {
    try {
      await api.patch(`/api/pedidos/${p.id}/entregar`);
      toast.show("Pedido marcado como entregue.");
      carregar();
    } catch {
      toast.show("Erro.");
    }
  }

  async function cancelarPedido(p: Pedido) {
    const motivo = prompt("Justificativa do cancelamento:");
    if (!motivo) return;

    try {
      await api.patch(`/api/pedidos/${p.id}/cancelar`, { motivo });
      toast.show("Pedido cancelado.");
      carregar();
    } catch {
      toast.show("Erro.");
    }
  }

  async function registrarPagamento() {
    try {
      await api.post("/api/pagamentos", {
        comandaId: comanda?.id,
        valor: Number(valorPago),
        formaPagamento,
      });

      toast.show("Pagamento registrado.");
      setModalPagamento(false);
      carregar();
    } catch {
      toast.show("Erro ao registrar pagamento.");
    }
  }

  async function fecharComanda() {
    if (!confirm("Fechar comanda?")) return;

    try {
      await api.patch(`/api/comandas/${comanda?.id}/fechar`);
      toast.show("Comanda fechada.");
      carregar();
    } catch {
      toast.show("Erro ao fechar comanda.");
    }
  }

  if (!comanda) return <p>Carregando...</p>;

  return (
    <>
      <PageHeader
        title={`Comanda #${comanda.id} — Mesa ${comanda.mesa.numero}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Detalhes */}
        <Card>
          <h2 className="text-sm font-semibold mb-3">Resumo da comanda</h2>
          <p className="text-sm">Cliente: {comanda.cliente || "-"}</p>
          <p className="text-sm mt-1">
            Total:
            <span className="font-bold">
              R$ {(comanda.total ?? 0).toFixed(2)}
            </span>
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => setModalNovoItem(true)}>Adicionar item</Button>
            <Button variant="outline" onClick={() => setModalPagamento(true)}>
              Registrar pagamento
            </Button>
            <Button variant="danger" onClick={fecharComanda}>
              Fechar comanda
            </Button>
          </div>
        </Card>

        {/* Pedidos */}
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3">
            Pedidos da comanda
          </h2>

          {pedidos.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhum pedido registrado.
            </p>
          )}

          <div className="space-y-4">
            {pedidos.map((p) => (
              <div
                key={p.id}
                className="border border-slate-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Pedido #{p.id}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(p.criadoEm).toLocaleString()}
                    </p>
                  </div>

                  <Badge
                    color={
                      p.status === "PENDENTE"
                        ? "warning"
                        : p.status === "ENTREGUE"
                        ? "success"
                        : "danger"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  {p.itens.map((it) => (
                    <div
                      key={it.id}
                      className="flex justify-between text-sm border-b border-slate-100 pb-1"
                    >
                      <span>
                        {it.quantidade}x {it.produto.nome}
                        {it.observacao && (
                          <span className="text-xs text-slate-400">
                            {" "}
                            ({it.observacao})
                          </span>
                        )}
                      </span>
                      <span>R$ {(it.produto.preco * it.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {p.status === "PENDENTE" && (
                    <Button size="sm" onClick={() => entregarPedido(p)}>
                      Marcar entregue
                    </Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => cancelarPedido(p)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Novo item */}
      <Modal
        open={modalNovoItem}
        title="Adicionar item ao pedido"
        onClose={() => setModalNovoItem(false)}
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium mb-1">
              Produto
            </label>
            <Select
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — R$ {p.preco.toFixed(2)}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Qtd
              </label>
              <Input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setQuantidade(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Observação
              </label>
              <Input
                value={observacao}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setObservacao(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalNovoItem(false)}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={adicionarItem}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pagamento */}
      <Modal
        open={modalPagamento}
        title="Registrar pagamento"
        onClose={() => setModalPagamento(false)}
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium mb-1">Valor</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={valorPago}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setValorPago(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Forma de pagamento
            </label>
            <Select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão</option>
              <option value="DINHEIRO">Dinheiro</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalPagamento(false)}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={registrarPagamento}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
