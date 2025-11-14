/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, ReactNode, useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  description?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  blockOutsideClick?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  description,
  onConfirm,
  onCancel,
  blockOutsideClick = false,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  
  // Fecha com ESC
  useEffect(() => {
    if (!open) return;

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        animate-fadeIn
      "
      role="dialog"
      aria-modal="true"
      onClick={() => !blockOutsideClick && onCancel()}
    >
      <Card
        className="
          w-[390px] p-6
          bg-white dark:bg-secondary-light 
          border border-slate-200 dark:border-secondary
          shadow-2xl rounded-2xl
          animate-scaleIn
        "
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* HEADER */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h3>

        {description && (
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* MESSAGE */}
        <div className="text-sm text-slate-700 dark:text-slate-300 mt-4 mb-6 leading-relaxed">
          {message}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>

          <Button variant="danger" onClick={handleConfirm} disabled={loading}>
            {loading ? "Processando..." : "Confirmar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
