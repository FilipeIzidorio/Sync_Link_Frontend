import  api  from "./api";
import { CategoriaDTO } from "../types/dto";

export const categoriaApi = {
  listar() {
    return api.get<CategoriaDTO[]>("/api/categorias");
  },
  listarAtivas() {
    return api.get<CategoriaDTO[]>("/api/categorias/ativas");
  },
  buscar(id: number) {
    return api.get<CategoriaDTO>(`/api/categorias/${id}`);
  },
  criar(dto: Omit<CategoriaDTO, "id">) {
    return api.post<CategoriaDTO>("/api/categorias", dto);
  },
  atualizar(id: number, dto: Omit<CategoriaDTO, "id">) {
    return api.put<CategoriaDTO>(`/api/categorias/${id}`, dto);
  },
  excluir(id: number) {
    return api.delete<void>(`/api/categorias/${id}`);
  },
};
