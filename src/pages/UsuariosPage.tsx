/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { usuarioApi } from "../api/usuarioApi";

import {
  UsuarioDTO,
  PerfilUsuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
} from "../types/dto";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { DataTable, Column } from "../components/common/DataTable";
import { ConfirmDialog } from "../components/common/ConfirmDialog";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UsuarioDTO | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<UsuarioDTO | null>(null);

  // Formulário
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "GARCOM" as PerfilUsuario,
    ativo: true,
  });

  // ===========================
  // BUSCAR USUÁRIOS
  // ===========================
  async function carregar() {
    setLoading(true);
    const res = await usuarioApi.listar();
    setUsuarios(res.data);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  // ===========================
  // ABRIR MODAL (novo ou editar)
  // ===========================
  function novoUsuario() {
    setEditing(null);
    setForm({
      nome: "",
      email: "",
      senha: "",
      perfil: "GARCOM",
      ativo: true,
    });
    setModalOpen(true);
  }

  function editarUsuario(u: UsuarioDTO) {
    setEditing(u);
    setForm({
      nome: u.nome,
      email: u.email,
      senha: "",
      perfil: u.perfil,
      ativo: u.ativo,
    });
    setModalOpen(true);
  }

  // ===========================
  // SALVAR (CREATE / UPDATE)
  // ===========================
  async function salvar() {
    if (!form.nome || !form.email) {
      alert("Preencha nome e email.");
      return;
    }

    setLoading(true);

    try {
      if (editing === null) {
        // CREATE
        const payload: CreateUsuarioDTO = {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          perfil: form.perfil,
        };

        await usuarioApi.criar(payload);
        alert("Usuário criado!");
      } else {
        // UPDATE
        const payload: UpdateUsuarioDTO = {
          nome: form.nome,
          email: form.email,
          perfil: form.perfil,
          ativo: form.ativo,
        };

        await usuarioApi.atualizar(editing.id, payload);
        alert("Usuário atualizado!");
      }

      setModalOpen(false);
      carregar();
    } catch (e) {
      alert("Erro ao salvar usuário.");
    }

    setLoading(false);
  }

  // ===========================
  // ATIVAR / INATIVAR
  // ===========================
  async function ativar(u: UsuarioDTO) {
    await usuarioApi.ativar(u.id);
    carregar();
  }

  async function inativar(u: UsuarioDTO) {
    await usuarioApi.inativar(u.id);
    carregar();
  }

  // ===========================
  // DELETAR
  // ===========================
  async function confirmarDeleteUsuario() {
    if (!confirmDelete) return;
    await usuarioApi.deletar(confirmDelete.id);
    setConfirmDelete(null);
    carregar();
  }

  // ===========================
  // COLUNAS DA TABELA
  // ===========================
  const columns: Column<UsuarioDTO>[] = [
    { header: "ID", accessor: "id" },
    { header: "Nome", accessor: "nome" },
    { header: "Email", accessor: "email" },
    { header: "Perfil", accessor: "perfil" },
    {
      header: "Ativo",
      render: (u) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            u.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {u.ativo ? "Sim" : "Não"}
        </span>
      ),
    },
    {
      header: "Ações",
      render: (u) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => editarUsuario(u)}>
            Editar
          </Button>

          {u.ativo ? (
            <Button variant="danger" size="sm" onClick={() => inativar(u)}>
              Inativar
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => ativar(u)}>
              Ativar
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmDelete(u)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Usuários</h2>

      <Button onClick={novoUsuario}>Novo Usuário</Button>

      <Card className="p-3">
        <DataTable<UsuarioDTO> data={usuarios} columns={columns} keyField="id" />
      </Card>

      {/* ======================
          MODAL
        ====================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-[420px] p-5 space-y-4">
            <h3 className="font-semibold text-sm">
              {editing ? "Editar Usuário" : "Novo Usuário"}
            </h3>

            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-xs">Nome</label>
              <Input
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs">Email</label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Senha — só aparece em criação */}
            {!editing && (
              <div className="flex flex-col gap-1">
                <label className="text-xs">Senha</label>
                <Input
                  type="password"
                  value={form.senha}
                  onChange={(e) =>
                    setForm({ ...form, senha: e.target.value })
                  }
                />
              </div>
            )}

            {/* Perfil */}
            <div className="flex flex-col gap-1">
              <label className="text-xs">Perfil</label>
              <Select
                value={form.perfil}
                onChange={(e) =>
                  setForm({
                    ...form,
                    perfil: e.target.value as PerfilUsuario,
                  })
                }
              >
                <option value="ADMIN">ADMIN</option>
                <option value="GERENTE">GERENTE</option>
                <option value="GARCOM">GARÇOM</option>
                <option value="COZINHA">COZINHA</option>
                <option value="CAIXA">CAIXA</option>
              </Select>
            </div>

            {/* Ativo — aparece só se editando */}
            {editing && (
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) =>
                    setForm({ ...form, ativo: e.target.checked })
                  }
                />
                <span className="text-xs">Usuário ativo</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={salvar} disabled={loading}>
                Salvar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ======================
          CONFIRM DIALOG
        ====================== */}
      {confirmDelete && (
        <ConfirmDialog
          title="Excluir usuário"
          message={`Deseja excluir ${confirmDelete.nome}?`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmarDeleteUsuario}
        />
      )}
    </div>
  );
}
