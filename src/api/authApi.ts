import  api  from "./api";
import {
  AuthRequest,
  AuthResponse,
  SignupRequest,
  MeResponse,
  TokenResponse,
} from "../types/dto";

export const authApi = {
  login(data: AuthRequest) {
    return api.post<AuthResponse>("/auth/login", data);
  },

  signup(data: SignupRequest) {
    return api.post<AuthResponse>("/auth/signup", data);
  },

  me() {
    return api.get<MeResponse>("/auth/me");
  },

  refresh() {
    return api.post<TokenResponse>("/auth/refresh");
  },
};
