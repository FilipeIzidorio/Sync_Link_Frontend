import { SetStateAction, useEffect, useState } from "react";
import  api from "../api/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { DataTable, Column } from "../components/common/DataTable";
import { Badge } from "../components/common/Badge";
import { toast } from "../components/ui/toast";

interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  async function carregar() {
    setLoading(true);
    try {
      const { data } = await api.get<Categoria[]>("/api/categorias");
      setCategorias(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setEditing(null);
    setNome("");
    setDescricao("");
    setModalOpen(true);
  }

  function abrirEdicao(cat: Categoria) {
    setEditing(cat);
    setNome(cat.nome);
    setDescricao(cat.descricao ?? "");
    setModalOpen(true);
  }

  async function salvar() {
    try {
      if (editing) {
        await api.put(`/api/categorias/${editing.id}`, {
          id: editing.id,
          nome,
          descricao,
          ativo: editing.ativo ?? true,
        });
        toast.show("Categoria atualizada.");
      } else {
        await api.post("/api/categorias", {
          nome,
          descricao,
          ativo: true,
        });
        toast.show("Categoria criada.");
      }
      setModalOpen(false);
      carregar();
    } catch {
      toast.show("Erro ao salvar categoria.");
    }
  }

  async function remover(cat: Categoria) {
    if (!confirm(`Remover categoria "${cat.nome}"?`)) return;
    try {
      await api.delete(`/api/categorias/${cat.id}`);
      toast.show("Categoria removida.");
      carregar();
    } catch {
      toast.show("Erro ao remover categoria.");
    }
  }

  const columns: Column<Categoria>[] = [
    { header: "ID", accessor: "id", width: "70px" },
    { header: "Nome", accessor: "nome" },
    {
      header: "Descrição",
      render: (c) => c.descricao ?? "-",
    },
    {
      header: "Status",
      align: "center",
      width: "110px",
      render: (c) => (
        <Badge color={c.ativo === false ? "default" : "success"}>
          {c.ativo === false ? "Inativa" : "Ativa"}
        </Badge>
      ),
    },
    {
      header: "Ações",
      align: "right",
      width: "160px",
      render: (c) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => abrirEdicao(c)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => remover(c)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Categorias" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Lista de categorias
            </h2>
            <Button size="sm" onClick={abrirNovo}>
              Nova categoria
            </Button>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <DataTable
              data={categorias}
              columns={columns}
              keyField="id"
              emptyMessage="Nenhuma categoria cadastrada."
            />
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-3">Resumo</h3>
          <p className="text-sm text-slate-500 mb-1">
            Total de categorias:{" "}
            <span className="font-semibold text-slate-800">
              {categorias.length}
            </span>
          </p>
          <p className="text-sm text-slate-500">
            Ativas:{" "}
            <span className="font-semibold text-emerald-600">
              {categorias.filter((c) => c.ativo !== false).length}
            </span>
          </p>
        </Card>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Editar categoria" : "Nova categoria"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium mb-1">Nome</label>
            <Input value={nome} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNome(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Descrição
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={salvar}>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
