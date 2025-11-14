import  api  from "./api";
import { PedidoDTO } from "../types/dto";

export interface CreatePedidoDTO {
  mesaId?: number;
  comandaId?: number;
}

export interface AdicionarItemPedidoDTO {
  produtoId: number;
  quantidade: number;
  observacao?: string;
}

export interface FecharPedidoDTO {
  observacao?: string;
}

export interface FinalizarVendaDTO {
  formaPagamento: string;
  valorPago: number;
}

export const pedidoApi = {
  // =============================
  // CONSULTAS
  // =============================
  listar() {
    return api.get<PedidoDTO[]>("/api/pedidos");
  },

  buscar(id: number) {
    return api.get<PedidoDTO>(`/api/pedidos/${id}`);
  },

  porStatus(status: string) {
    return api.get<PedidoDTO[]>(`/api/pedidos/status/${status}`);
  },

  porMesa(mesaId: number) {
    return api.get<PedidoDTO[]>(`/api/pedidos/mesa/${mesaId}`);
  },

  ativos() {
    return api.get<PedidoDTO[]>("/api/pedidos/ativos");
  },

  // =============================
  // CRUD DE PEDIDO
  // =============================
  criar(dto: CreatePedidoDTO) {
    return api.post<PedidoDTO>("/api/pedidos", dto);
  },

  deletar(id: number) {
    return api.delete<void>(`/api/pedidos/${id}`);
  },

  // =============================
  // ITENS DO PEDIDO
  // =============================
  adicionarItem(id: number, dto: AdicionarItemPedidoDTO) {
    return api.post<PedidoDTO>(`/api/pedidos/${id}/itens`, dto);
  },

  removerItem(pedidoId: number, itemId: number) {
    return api.delete<PedidoDTO>(`/api/pedidos/${pedidoId}/itens/${itemId}`);
  },

  atualizarQuantidade(pedidoId: number, itemId: number, quantidade: number) {
    return api.patch<PedidoDTO>(
      `/api/pedidos/${pedidoId}/quantidade-item/${itemId}`,
      null,
      { params: { quantidade } }
    );
  },

  // =============================
  // STATUS DO PEDIDO
  // =============================
  atualizarStatus(id: number, status: string) {
    return api.patch<PedidoDTO>(`/api/pedidos/${id}/status`, null, {
      params: { status },
    });
  },

  cancelar(id: number, motivo: string) {
    return api.post<PedidoDTO>(`/api/pedidos/${id}/cancelar`, null, {
      params: { motivo },
    });
  },

  // =============================
  // FECHAMENTO / VENDA
  // =============================
  fechar(id: number, dto: FecharPedidoDTO) {
    return api.post<PedidoDTO>(`/api/pedidos/${id}/fechar`, dto);
  },

  finalizarVenda(id: number, dto: FinalizarVendaDTO) {
    return api.post(`/api/pedidos/${id}/finalizar-venda`, dto);
  },

  calcularTroco(id: number, valorPago: number) {
    return api.get<number>(`/api/pedidos/${id}/troco`, {
      params: { valorPago },
    });
  },
};
