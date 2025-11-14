import {
  forwardRef,
  SelectHTMLAttributes,
  ReactNode,
} from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, className, children, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {label}
          </label>
        )}

        <select
          ref={ref}
          {...rest}
          className={clsx(
            "px-3 py-2 rounded-md border text-sm",
            "bg-white dark:bg-secondary-light",
            "border-slate-300 dark:border-secondary",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            error && "border-red-500",
            className
          )}
        >
          {children}
        </select>

        {error && (
          <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
        )}

        {helperText && !error && (
          <span className="text-xs text-slate-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
