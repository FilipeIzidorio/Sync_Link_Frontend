import { ReactNode, useMemo, useState } from "react";
import { Input } from "../ui/Input";

export type Align = "left" | "center" | "right";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  width?: string;
  align?: Align;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T | ((row: T) => string | number);
  emptyMessage?: string;
  searchable?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  emptyMessage = "Nenhum registro encontrado.",
  searchable = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  // 🔎 FILTRO GLOBAL
  const filteredData = useMemo(() => {
    if (!search) return data;

    const term = search.toLowerCase();

    return data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(term)
    );
  }, [data, search]);

  // 🔑 RESOLVE KEY
  const resolveKey = (row: T): string | number => {
    if (typeof keyField === "function") return keyField(row);

    const keyVal = row[keyField];
    return typeof keyVal === "string" || typeof keyVal === "number"
      ? keyVal
      : String(keyVal);
  };

  return (
    <div className="space-y-3">
      {/* 🔎 SEARCH BAR */}
      {searchable && (
        <div className="max-w-xs">
          <Input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-secondary-light">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* EMPTY STATE */}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {/* ROWS */}
            {filteredData.map((row) => (
              <tr
                key={resolveKey(row)}
                className="bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary-light/60 transition"
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-2 align-middle ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.render
                      ? col.render(row)
                      : col.accessor
                      ? (row[col.accessor] as ReactNode)
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
