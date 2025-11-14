import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/sync-link";

const api = axios.create({
  baseURL,
});

// pega token salvo no localStorage
function getToken() {
  return localStorage.getItem("token");
}

// interceptor pra adicionar Authorization: Bearer
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
