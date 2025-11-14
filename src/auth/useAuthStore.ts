import { create } from "zustand";
import { persist } from "zustand/middleware";
import  api  from "../api/api";
import { AuthRequest, AuthResponse, MeResponse, PerfilUsuario } from "../types/dto";

interface AuthState {
  user: MeResponse | null;
  token: string | null;
  loading: boolean;

  login: (cred: AuthRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAllowed: (roles: PerfilUsuario[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (cred: AuthRequest) => {
        set({ loading: true });

        try {
          const resp = await api.post<AuthResponse>("/auth/login", cred);
          const { token, nome, email, perfil, id } = resp.data;

          localStorage.setItem("token", token);

          set({
            token,
            user: { id, nome, email, perfil },
          });

          await get().refreshUser();
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },

      refreshUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const resp = await api.get<MeResponse>("/auth/me");
          set({ user: resp.data });
        } catch {
          set({ user: null, token: null });
        }
      },

      isAllowed: (roles) => {
        const u = get().user;
        if (!u) return false;
        return roles.includes(u.perfil);
      },
    }),
    {
      name: "synclink-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
