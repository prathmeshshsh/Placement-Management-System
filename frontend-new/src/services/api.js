import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  timeout: 15000,
  withCredentials: true,
});

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("currentUser");
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Never send the old X-Demo-Role header. Protected API requests use real JWT auth.
  delete config.headers["X-Demo-Role"];
  return config;
});

let refreshPromise = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/refresh") || url.includes("/auth/logout");

    if (error.response?.status !== 401 || !original || original._retry || isAuthRequest) {
      throw error;
    }

    original._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true, timeout: api.defaults.timeout },
        ).then((response) => {
          const token = response.data?.access_token;
          if (!token) throw new Error("Refresh response did not include an access token.");
          localStorage.setItem("accessToken", token);
          return token;
        }).finally(() => { refreshPromise = null; });
      }
      const token = await refreshPromise;
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      clearSession();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login?session=expired");
      }
      throw refreshError;
    }
  },
);

export default api;
