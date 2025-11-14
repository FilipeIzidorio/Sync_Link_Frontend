import  api  from "./api";
import {
  UsuarioDTO,
  PerfilUsuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
} from "../types/dto";

export const usuarioApi = {
  listar() {
    return api.get<UsuarioDTO[]>("/api/usuarios");
  },

  buscar(id: number) {
    return api.get<UsuarioDTO>(`/api/usuarios/${id}`);
  },

  // ------ CRIAÇÃO CORRETA (CREATEUsuarioDTO) ------
  criar(dto: CreateUsuarioDTO) {
    return api.post<UsuarioDTO>("/api/usuarios", dto);
  },

  // ------ ATUALIZAÇÃO CORRETA (UpdateUsuarioDTO) ------
  atualizar(id: number, dto: UpdateUsuarioDTO) {
    return api.put<UsuarioDTO>(`/api/usuarios/${id}`, dto);
  },

  deletar(id: number) {
    return api.delete<void>(`/api/usuarios/${id}`);
  },

  ativar(id: number) {
    return api.patch<UsuarioDTO>(`/api/usuarios/${id}/ativar`);
  },

  inativar(id: number) {
    return api.patch<UsuarioDTO>(`/api/usuarios/${id}/inativar`);
  },

  porPerfil(perfil: PerfilUsuario) {
    return api.get<UsuarioDTO[]>(`/api/usuarios/perfil/${perfil}`);
  },

  ativos() {
    return api.get<UsuarioDTO[]>("/api/usuarios/ativos");
  },

  meuPerfil() {
    return api.get<UsuarioDTO>("/api/usuarios/meu-perfil");
  },
};
