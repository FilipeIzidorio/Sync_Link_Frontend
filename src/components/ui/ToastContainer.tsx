/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast, ToastMessage } from "../ui/toast";

export function ToastContainer() {
  const [current, setCurrent] = useState<ToastMessage | null>(null);

  useEffect(() => {
    toast.subscribe((msg: any) => {
      setCurrent(msg);
      setTimeout(() => setCurrent(null), 3000);
    });
  }, []);

  if (!current) return null;

  const colors = {
    default: "bg-slate-800",
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
    info: "bg-blue-600",
  };

  return (
    <div className="fixed bottom-6 right-6 animate-fade-in">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg text-white ${colors[current.type]}`}
      >
        {current.message}
      </div>
    </div>
  );
}
