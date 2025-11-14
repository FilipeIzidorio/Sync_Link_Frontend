// ============================
// 🔐 AUTH
// ============================
export interface AuthRequest {
  email: string;
  senha: string;
}

export interface SignupRequest {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario; // ADMIN | GERENTE | GARCOM | COZINHA | CAIXA
}

export interface AuthResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface MeResponse {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface TokenResponse {
  token: string;
  tipo: string;
  expiresInSeconds: number;
}

// ============================
// 🏷️ CATEGORIA
// ============================
export interface CategoriaDTO {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

// ============================
// 🍔 PRODUTO
// ============================
export interface ProdutoDTO {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  categoriaId: number;
  categoriaNome?: string;
  ativo: boolean;
}

// ============================
// 🪑 MESA
// ============================
export type StatusMesa =
  | "LIVRE"
  | "OCUPADA"
  | "RESERVADA"
  | "FECHADA";

export interface MesaDTO {
  id: number;
  numero: number;
  status: StatusMesa;
  capacidade?: number;
}

export interface MesaResumoDTO {
  id: number;
  numero: number;
  status: StatusMesa;
}

// ============================
// 📟 COMANDA
// ============================
export type StatusComanda =
  | "ABERTA"
  | "EM_ANDAMENTO"
  | "FECHADA"
  | "CANCELADA";

export interface ComandaDTO {
  id: number;
  codigo: string;
  mesaId: number;
  mesaNumero: number;
  cliente?: string;
  status: StatusComanda;
  total: number;
  pedidos: PedidoDTO[];
}

// ============================
// 🧾 PEDIDO
// ============================
export type StatusPedido =
  | "PENDENTE"
  | "EM_PREPARACAO"
  | "PRONTO"
  | "ENTREGUE"
  | "CANCELADO";

export interface ItemPedidoDTO {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  observacao?: string;
  valorUnitario: number;
  total: number;
}

export interface PedidoDTO {
  id: number;
  comandaId?: number;
  mesaId?: number;
  status: StatusPedido;
  itens: ItemPedidoDTO[];
  total: number;
}

// ============================
// 📦 ESTOQUE
// ============================
export interface EstoqueDTO {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
}

// ============================
// 💰 PAGAMENTO
// ============================
export type FormaPagamento =
  | "DINHEIRO"
  | "CARTAO_CREDITO"
  | "CARTAO_DEBITO"
  | "PIX"
  | "VALE_REFEICAO"
  | "OUTROS";

export type StatusPagamento =
  | "PENDENTE"
  | "PARCIAL"
  | "PAGO"
  | "CANCELADO";

export interface PagamentoDTO {
  id: number;
  pedidoId: number;
  valor: number;
  formaPagamento: FormaPagamento;
  status: StatusPagamento;
  dataHora: string;
}

// ============================
// 👤 USUÁRIO
// ============================
export type PerfilUsuario =
  | "ADMIN"
  | "GERENTE"
  | "GARCOM"
  | "CAIXA";

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
}

export type CreateUsuarioDTO = {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
};

export type UpdateUsuarioDTO = {
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
};
