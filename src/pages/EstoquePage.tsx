/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { estoqueApi } from "../api/estoqueApi";
import { EstoqueDTO } from "../types/dto";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DataTable, Column } from "../components/common/DataTable";
import {ConfirmDialog} from "../components/common/ConfirmDialog";

export default function EstoquePage() {
  const [itens, setItens] = useState<EstoqueDTO[]>([]);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: number | null;
    action: "add" | "remove" | null;
  }>({
    open: false,
    id: null,
    action: null,
  });

  async function carregar() {
    const res = await estoqueApi.listar();
    setItens(res.data);
  }

  useEffect(() => {
    carregar();
  }, []);

  // ================================
  // ADICIONAR QUANTIDADE
  // ================================
  async function adicionar(id: number) {
    const qtd = Number(prompt("Quantidade a adicionar:"));
    if (!qtd || qtd <= 0) return;

    await estoqueApi.adicionar(id, qtd);
    carregar();
  }

  // ================================
  // REMOVER QUANTIDADE
  // ================================
  async function remover(id: number) {
    const qtd = Number(prompt("Quantidade a remover:"));
    if (!qtd || qtd <= 0) return;

    await estoqueApi.remover(id, qtd);
    carregar();
  }

  const colunas: Column<EstoqueDTO>[] = [
    { header: "ID", accessor: "id" },
    { header: "Produto", accessor: "produtoNome" },
    { header: "Atual", accessor: "quantidadeAtual" },
    { header: "Min.", accessor: "quantidadeMinima" },

    {
      header: "Status",
      render: (e) =>
        e.quantidadeAtual <= e.quantidadeMinima ? (
          <span className="text-red-600 font-semibold">Repor</span>
        ) : (
          <span className="text-green-600 font-semibold">OK</span>
        ),
    },

    {
      header: "Ações",
      render: (e) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => adicionar(e.id)}>
            +
          </Button>

          <Button size="sm" variant="danger" onClick={() => remover(e.id)}>
            -
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Estoque</h2>

      <Card className="p-3">
        <DataTable data={itens} columns={colunas} keyField="id" />
      </Card>

      <ConfirmDialog
        open={confirm.open}
        title="Confirmar ação"
        message="Tem certeza?"
        onCancel={() =>
          setConfirm({ open: false, id: null, action: null })
        }
        onConfirm={() => {
          if (confirm.id && confirm.action === "add") adicionar(confirm.id);
          if (confirm.id && confirm.action === "remove") remover(confirm.id);
          setConfirm({ open: false, id: null, action: null });
        }}
      />
    </div>
  );
}
