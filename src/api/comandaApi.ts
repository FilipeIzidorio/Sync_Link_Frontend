import  api from "./api";
import { ComandaDTO } from "../types/dto";

export const comandaApi = {
  abrirParaMesa(mesaId: number) {
    return api.post<ComandaDTO>(`/api/comandas/mesa/${mesaId}`);
  },
  fechar(id: number) {
    return api.post<ComandaDTO>(`/api/comandas/${id}/fechar`);
  },
  cancelar(id: number, motivo: string) {
    return api.post<ComandaDTO>(`/api/comandas/${id}/cancelar`, null, {
      params: { motivo },
    });
  },
  buscar(id: number) {
    return api.get<ComandaDTO>(`/api/comandas/${id}`);
  },
  porCodigo(codigo: string) {
    return api.get<ComandaDTO>(`/api/comandas/codigo/${codigo}`);
  },
  porMesa(mesaId: number) {
    return api.get<ComandaDTO[]>(`/api/comandas/mesa/${mesaId}`);
  },
  abertas() {
    return api.get<ComandaDTO[]>("/api/comandas/abertas");
  },
  porStatus(status: string) {
    return api.get<ComandaDTO[]>(`/api/comandas/status/${status}`);
  },
  adicionarPedido(comandaId: number, pedidoId: number) {
    return api.post<ComandaDTO>(`/api/comandas/${comandaId}/pedidos/${pedidoId}`);
  },
  removerPedido(comandaId: number, pedidoId: number) {
    return api.delete<ComandaDTO>(`/api/comandas/${comandaId}/pedidos/${pedidoId}`);
  },
};
