import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-xl font-semibold mb-3 text-red-600">
          Acesso Negado
        </h1>
        <p className="text-slate-600 mb-4">
          Você não tem permissão para acessar esta página.
        </p>
        <Link
          to="/"
          className="text-primary font-medium hover:underline"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
