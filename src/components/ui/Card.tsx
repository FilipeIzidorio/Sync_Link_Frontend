import { forwardRef, HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card Component — estilização padronizada para containers.
 * - Aceita todas props de <div>
 * - Suporta refs
 * - Segue tema Sync Link
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        {...rest}
        className={clsx(
          "bg-white dark:bg-secondary-light",
          "shadow-card border border-slate-200 dark:border-secondary",
          "rounded-xl p-5 transition-colors duration-300",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
