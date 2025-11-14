import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...rest}
          className={clsx(
            "px-3 py-2 rounded-md border text-sm",
            "bg-white dark:bg-secondary-light",
            "border-slate-300 dark:border-secondary",
            "focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light",
            error && "border-red-500 dark:border-red-400",
            className
          )}
        />

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

Input.displayName = "Input";
