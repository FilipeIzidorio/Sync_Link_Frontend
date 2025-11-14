import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "danger"
  | "ghost"
  | "success"
  | "warning"
  | "info";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", className, ...props }, ref) => {
    const base =
      "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

    const variants: Record<ButtonVariant, string> = {
      primary: "bg-primary text-white hover:bg-primary-dark shadow-btn",
      outline:
        "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200",
      danger: "bg-danger text-white hover:bg-danger-dark shadow-btn",
      ghost:
        "text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-secondary-light",

      // 🟩 sucesso
      success: "bg-success text-white hover:bg-success-dark",

      // 🟨 aviso
      warning: "bg-warning text-white hover:bg-warning-dark",

      // 🔵 informativo
      info: "bg-info text-white hover:bg-info-dark",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-5 py-2.5",
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
