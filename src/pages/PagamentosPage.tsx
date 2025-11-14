/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import  {api} from "../api/api";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "../components/common/Badge";

interface Pagamento {
  id: number;
  valor: number;
  formaPagamento: string;
  dataHora: string;
  usuarioCaixa: { nome: string };
  comanda: { codigo: string };
}

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const { data } = await api.get<Pagamento[]>("/api/pagamentos");
      setPagamentos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <>
      <PageHeader title="Pagamentos" />

      <Card>
        <h2 className="text-sm font-semibold mb-4">
          Pagamentos registrados
        </h2>

        <div className="space-y-3">
          {loading && <p>Carregando...</p>}

          {pagamentos.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">
                  R$ {p.valor.toFixed(2)} — {p.formaPagamento}
                </p>
                <p className="text-xs text-slate-500">
                  Comanda {p.comanda.codigo} — Caixa: {p.usuarioCaixa.nome}
                </p>
              </div>

              <Badge color="info">
                {new Date(p.dataHora).toLocaleString()}
              </Badge>
            </div>
          ))}

          {!loading && pagamentos.length === 0 && (
            <p className="text-sm text-slate-500">
              Nenhum pagamento registrado.
            </p>
          )}
        </div>
      </Card>
    </>
  );
}
