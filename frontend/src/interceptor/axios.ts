import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKENDHOST}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => error.response
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.warn("No refresh token available. Logging out.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        /*   window.location.href = "/login"; */
        return error.response;
      }

      try {
        const response = await api.post("/api/token/refresh/", { refresh: refreshToken });

        localStorage.setItem("access_token", response.data.access);
        originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        /*   window.location.href = "/login"; */
        return Promise.reject(refreshError);
      }
    }

    return error.response;
  }
);
