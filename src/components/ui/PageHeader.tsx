export const PageHeader = ({ title }: { title: string }) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
        {title}
      </h1>
    </div>
  );
};
