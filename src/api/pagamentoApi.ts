import  api  from "./api";
import {
  PagamentoDTO,
  FormaPagamento,
  StatusPagamento,
} from "../types/dto";

export const pagamentoApi = {
  listarTodos() {
    return api.get<PagamentoDTO[]>("/api/pagamentos");
  },

  buscar(id: number) {
    return api.get<PagamentoDTO>(`/api/pagamentos/${id}`);
  },

  criar(dto: PagamentoDTO) {
    return api.post<PagamentoDTO>("/api/pagamentos", dto);
  },

  atualizar(id: number, dto: PagamentoDTO) {
    return api.put<PagamentoDTO>(`/api/pagamentos/${id}`, dto);
  },

  excluir(id: number) {
    return api.delete<void>(`/api/pagamentos/${id}`);
  },

  processarPagamento(pedidoId: number, formaPagamento: FormaPagamento, valor: number) {
    return api.post<PagamentoDTO>(
      `/api/pagamentos/pedido/${pedidoId}/processar`,
      null,
      { params: { formaPagamento, valor } }
    );
  },

  processarPagamentoCompleto(pedidoId: number, dto: PagamentoDTO) {
    return api.post<PagamentoDTO>(
      `/api/pagamentos/pedido/${pedidoId}/completo`,
      dto
    );
  },

  confirmar(id: number) {
    return api.post<PagamentoDTO>(`/api/pagamentos/${id}/confirmar`);
  },

  estornar(id: number) {
    return api.post<PagamentoDTO>(`/api/pagamentos/${id}/estornar`);
  },

  recusar(id: number, motivo: string) {
    return api.post<PagamentoDTO>(
      `/api/pagamentos/${id}/recusar`,
      null,
      { params: { motivo } }
    );
  },

  porPedido(pedidoId: number) {
    return api.get<PagamentoDTO[]>(`/api/pagamentos/pedido/${pedidoId}`);
  },

  porStatus(status: StatusPagamento) {
    return api.get<PagamentoDTO[]>(`/api/pagamentos/status/${status}`);
  },

  porForma(formaPagamento: FormaPagamento) {
    return api.get<PagamentoDTO[]>(`/api/pagamentos/forma/${formaPagamento}`);
  },

  porPeriodo(dataInicio: string, dataFim: string) {
    return api.get<PagamentoDTO[]>("/api/pagamentos/periodo", {
      params: { dataInicio, dataFim },
    });
  },

  totalPorPeriodo(dataInicio: string, dataFim: string) {
    return api.get<number>("/api/pagamentos/total-periodo", {
      params: { dataInicio, dataFim },
    });
  },

  porDia(data: string) {
    return api.get<PagamentoDTO[]>(`/api/pagamentos/dia/${data}`);
  },
};
