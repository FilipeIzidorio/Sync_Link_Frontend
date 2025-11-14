import type {
  PerfilUsuario,
  StatusMesa,
  StatusComanda,
  StatusPedido,
  FormaPagamento,
} from "./enums";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
}

export interface Mesa {
  id: number;
  numero: number;
  status: StatusMesa;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
  categoria: Categoria;
}

export interface ItemPedido {
  id: number;
  produto: Produto;
  quantidade: number;
  observacao?: string;
  subtotal: number;
}

export interface Pedido {
  id: number;
  status: StatusPedido;
  itens: ItemPedido[];
  criadoEm: string;
}

export interface Comanda {
  id: number;
  mesa: Mesa;
  cliente?: string;
  status: StatusComanda;
  pedidos: Pedido[];
  total: number;
  desconto?: number;
}

export interface Pagamento {
  id: number;
  valor: number;
  formaPagamento: FormaPagamento;
  dataHora: string;
  usuarioCaixa: Usuario;
}

export interface ResumoFinanceiro {
  totalComanda: number;
  totalPago: number;
  restante: number;
}
