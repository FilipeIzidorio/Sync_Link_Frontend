import clsx from "clsx";

type BadgeColor =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary";

export const Badge = ({
  children,
  color = "default",
  className,
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}) => {
  const colors: Record<BadgeColor, string> = {
    default: "bg-slate-200 text-slate-700",
    success: "bg-success/15 text-success-dark",
    danger: "bg-danger/15 text-danger-dark",
    warning: "bg-warning/15 text-warning-dark",
    info: "bg-info/15 text-info-dark",
    primary: "bg-primary/15 text-primary-dark",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
};
