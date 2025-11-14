import  api  from "./api";
import { ProdutoDTO } from "../types/dto";

export const produtoApi = {
  listar() {
    return api.get<ProdutoDTO[]>("/api/produtos");
  },

  listarAtivos() {
    return api.get<ProdutoDTO[]>("/api/produtos/ativos");
  },

  buscar(id: number) {
    return api.get<ProdutoDTO>(`/api/produtos/${id}`);
  },

  criar(dto: Omit<ProdutoDTO, "id" | "categoriaNome">) {
    return api.post<ProdutoDTO>("/api/produtos", dto);
  },

  atualizar(id: number, dto: Omit<ProdutoDTO, "id" | "categoriaNome">) {
    return api.put<ProdutoDTO>(`/api/produtos/${id}`, dto);
  },

  excluir(id: number) {
    return api.delete<void>(`/api/produtos/${id}`);
  },

  porCategoria(categoriaId: number) {
    return api.get<ProdutoDTO[]>(`/api/produtos/categoria/${categoriaId}`);
  },

  ativar(id: number) {
    return api.patch<ProdutoDTO>(`/api/produtos/${id}/ativar`);
  },

  inativar(id: number) {
    return api.patch<ProdutoDTO>(`/api/produtos/${id}/inativar`);
  },
};
