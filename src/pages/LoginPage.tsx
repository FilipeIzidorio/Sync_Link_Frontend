/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuthStore } from "../auth/useAuthStore"; 
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await login({ email, senha });
      navigate("/");  
    } catch {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary text-white">
      <div className="w-full max-w-md bg-secondary-light rounded-2xl p-8 shadow-xl animate-fadeIn">
        
        {/* Logo / Título */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-title font-bold tracking-wide text-primary">
            Sync Link
          </h1>
          <p className="text-sm text-slate-400 mt-1">Acesso ao sistema</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          {erro && (
            <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
              {erro}
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Entrando...</span>
            ) : (
              <>
                <LogIn size={18} /> Entrar
              </>
            )}
          </Button>
        </form>

        {/* Rodapé */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Sistema de Gestão Sync Link • 2025
        </p>
      </div>
    </div>
  );
}
