import api  from "./api";
import { FormaPagamento } from "../types/dto";

export const relatorioApi = {
  estatisticasPedidos(inicio: string, fim: string) {
    return api.get(`/api/pedidos/estatisticas`, {
      params: { inicio, fim },
    });
  },

  totalPeriodo(inicio: string, fim: string) {
    return api.get<number>("/api/pagamentos/total-periodo", {
      params: { inicio, fim },
    });
  },

  porForma(forma: FormaPagamento, inicio: string, fim: string) {
    return api.get<number>(`/api/pagamentos/forma/${forma}`, {
      params: { inicio, fim },
    });
  },
};
