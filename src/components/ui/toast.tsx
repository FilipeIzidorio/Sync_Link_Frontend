export type ToastType = "default" | "success" | "error" | "warning" | "info";

export interface ToastMessage {
  message: string;
  type: ToastType;
}

export type ToastListener = (toast: ToastMessage) => void;

export const toast = {
  listeners: [] as ToastListener[],

  // Exibir toast genérico
  show(message: string, type: ToastType = "default") {
    this.listeners.forEach((fn) => fn({ message, type }));
  },

  // Métodos especializados
  success(message: string) {
    this.show(message, "success");
  },

  error(message: string) {
    this.show(message, "error");
  },

  warning(message: string) {
    this.show(message, "warning");
  },

  info(message: string) {
    this.show(message, "info");
  },

  subscribe(fn: ToastListener) {
    this.listeners.push(fn);
  },
};
