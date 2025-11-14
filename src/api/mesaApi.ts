import  api  from "./api";
import { MesaDTO, MesaResumoDTO, StatusMesa } from "../types/dto";

export const mesaApi = {
  listar() {
    return api.get<MesaDTO[]>("/api/mesas");
  },
  listarResumo() {
    return api.get<MesaResumoDTO[]>("/api/mesas/resumo");
  },
  listarLivres() {
    return api.get<MesaDTO[]>("/api/mesas/livres");
  },
  porStatus(status: StatusMesa) {
    return api.get<MesaDTO[]>(`/api/mesas/status/${status}`);
  },
  buscar(id: number) {
    return api.get<MesaDTO>(`/api/mesas/${id}`);
  },
  criar(dto: Omit<MesaDTO, "id">) {
    return api.post<MesaDTO>("/api/mesas", dto);
  },
  atualizar(id: number, dto: Omit<MesaDTO, "id">) {
    return api.put<MesaDTO>(`/api/mesas/${id}`, dto);
  },
  deletar(id: number) {
    return api.delete<void>(`/api/mesas/${id}`);
  },
  alterarStatus(id: number, status: StatusMesa) {
    return api.patch<MesaDTO>(`/api/mesas/${id}/status`, null, {
      params: { status },
    });
  },
};
