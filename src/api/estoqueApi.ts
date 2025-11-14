import  api  from "./api";
import { EstoqueDTO } from "../types/dto";

export const estoqueApi = {
  listar() {
    return api.get<EstoqueDTO[]>("/api/estoques");
  },

  buscar(id: number) {
    return api.get<EstoqueDTO>(`/api/estoques/${id}`);
  },

  criar(dto: Omit<EstoqueDTO, "id" | "produtoNome">) {
    return api.post<EstoqueDTO>("/api/estoques", dto);
  },

  atualizar(id: number, dto: Omit<EstoqueDTO, "id" | "produtoNome">) {
    return api.put<EstoqueDTO>(`/api/estoques/${id}`, dto);
  },

  excluir(id: number) {
    return api.delete<void>(`/api/estoques/${id}`);
  },

  porProduto(produtoId: number) {
    return api.get<EstoqueDTO[]>(`/api/estoques/produto/${produtoId}`);
  },

  precisaReposicao() {
    return api.get<EstoqueDTO[]>("/api/estoques/reposicao");
  },

  adicionar(id: number, quantidade: number) {
    return api.patch<EstoqueDTO>(
      `/api/estoques/${id}/adicionar`,
      null,
      { params: { quantidade } }
    );
  },

  remover(id: number, quantidade: number) {
    return api.patch<EstoqueDTO>(
      `/api/estoques/${id}/remover`,
      null,
      { params: { quantidade } }
    );
  },
};
