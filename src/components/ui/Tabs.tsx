import clsx from "clsx";

export const Tabs = ({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) => {
  return (
    <div className="flex gap-2 border-b border-slate-300 pb-1 mb-4">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={clsx(
            "px-3 py-1 rounded-lg text-sm transition",
            active === t
              ? "bg-primary text-white shadow-btn"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-secondary-light"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
};
