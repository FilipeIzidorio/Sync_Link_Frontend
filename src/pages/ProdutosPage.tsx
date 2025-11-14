/* eslint-disable react-hooks/set-state-in-effect */
// src/pages/ProdutosPage.tsx
import { useEffect, useState } from "react";
import { produtoApi } from "../api/produtoApi";
import { categoriaApi } from "../api/categoriaApi";
import { ProdutoDTO, CategoriaDTO } from "../types/dto";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { DataTable, Column } from "../components/common/DataTable";
import { Badge } from "../components/common/Badge";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [form, setForm] = useState<Partial<ProdutoDTO>>({
    nome: "",
    descricao: "",
    preco: 0,
    categoriaId: 0,
    ativo: true,
  });
  const [editId, setEditId] = useState<number | null>(null);

  async function carregar() {
    const [prodRes, catRes] = await Promise.all([
      produtoApi.listar(),
      categoriaApi.listarAtivas(),
    ]);
    setProdutos(prodRes.data);
    setCategorias(catRes.data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    const payload = {
      nome: form.nome ?? "",
      descricao: form.descricao ?? "",
      preco: Number(form.preco),
      categoriaId: Number(form.categoriaId),
      ativo: form.ativo ?? true,
    };

    if (editId) {
      await produtoApi.atualizar(editId, payload);
    } else {
      await produtoApi.criar(payload);
    }
    setEditId(null);
    setForm({ nome: "", descricao: "", preco: 0, categoriaId: 0, ativo: true });
    carregar();
  }

  async function editar(p: ProdutoDTO) {
    setForm({
      nome: p.nome,
      descricao: p.descricao,
      preco: p.preco,
      categoriaId: p.categoriaId,
      ativo: p.ativo,
    });
    setEditId(p.id);
  }

  async function excluir(p: ProdutoDTO) {
    if (!confirm(`Excluir produto "${p.nome}"?`)) return;
    await produtoApi.excluir(p.id);
    carregar();
  }

  async function alterarStatus(p: ProdutoDTO) {
    if (p.ativo) {
      await produtoApi.inativar(p.id);
    } else {
      await produtoApi.ativar(p.id);
    }
    carregar();
  }

  const columns: Column<ProdutoDTO>[] = [
    { header: "Nome", accessor: "nome" },
    {
      header: "Categoria",
      accessor: "categoriaNome",
    },
    {
      header: "Preço",
      render: (p) => `R$ ${p.preco.toFixed(2)}`,
    },
    {
      header: "Status",
      render: (p) => (
        <Badge color={p.ativo ? "success" : "default"}>
          {p.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      header: "Ações",
      render: (p) => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={() => editar(p)}>
            Editar
          </Button>
          <Button size="sm" onClick={() => alterarStatus(p)}>
            {p.ativo ? "Inativar" : "Ativar"}
          </Button>
          <Button size="sm" variant="danger" onClick={() => excluir(p)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Produtos</h2>

      <Card className="space-y-3">
        <h3 className="font-medium text-sm">
          {editId ? "Editar produto" : "Novo produto"}
        </h3>

        <div className="grid md:grid-cols-4 gap-3 text-sm">
          <div className="md:col-span-2">
            <label className="text-xs block mb-1">Nome</label>
            <Input
              value={form.nome ?? ""}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Preço</label>
            <Input
              type="number"
              value={form.preco ?? 0}
              onChange={(e) =>
                setForm({ ...form, preco: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Categoria</label>
            <Select
              value={String(form.categoriaId ?? 0)}
              onChange={(e) =>
                setForm({ ...form, categoriaId: Number(e.target.value) })
              }
            >
              <option value={0}>Selecione...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-4">
            <label className="text-xs block mb-1">Descrição</label>
            <Input
              value={form.descricao ?? ""}
              onChange={(e) =>
                setForm({ ...form, descricao: e.target.value })
              }
            />
          </div>
        </div>

        <Button onClick={salvar}>
          {editId ? "Atualizar" : "Salvar"}
        </Button>
      </Card>

      <DataTable
        data={produtos}
        columns={columns}
        keyField="id"
        emptyMessage="Nenhum produto cadastrado."
      />
    </div>
  );
}
