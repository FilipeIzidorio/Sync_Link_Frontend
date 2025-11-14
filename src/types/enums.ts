export enum PerfilUsuario {
  ADMIN = "ADMIN",
  GERENTE = "GERENTE",
  GARCOM = "GARCOM",
  COZINHA = "COZINHA",
  CAIXA = "CAIXA"
}


export type StatusMesa = "LIVRE" | "OCUPADA" | "FECHADA";

export type StatusComanda = "ABERTA" | "EM_ANDAMENTO" | "FECHADA";

export type StatusPedido = "PENDENTE" | "ENTREGUE" | "CANCELADO";

export type FormaPagamento = "CARTAO_CREDITO" | "PIX" | "DINHEIRO" | "CARTAO_DEBITO"| "OUTRO";

export type StatusPagamento = "PENDENTE" | "PARCIAL" | "PAGO" | "CANCELADO";
