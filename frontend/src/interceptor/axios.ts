import axios from "axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "@/constants/token";
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from "@/utils/auth";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKENDHOST}/api`,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

api.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem(ACCESS_TOKEN_KEY);
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

      const refreshToken = getLocalStorageItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        console.warn("No refresh token found. Logging out.");
        removeLocalStorageItem(ACCESS_TOKEN_KEY);
        removeLocalStorageItem(REFRESH_TOKEN_KEY);
        removeLocalStorageItem(USER_KEY);
        window.location.href = "/auth/sign-in";
        return error.response;
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKENDHOST}/api/auth/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const newAccessToken = response.data.access;
          setLocalStorageItem(ACCESS_TOKEN_KEY, newAccessToken);
          onTokenRefreshed(newAccessToken);
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed. Logging out.");
          removeLocalStorageItem(ACCESS_TOKEN_KEY);
          removeLocalStorageItem(REFRESH_TOKEN_KEY);
          removeLocalStorageItem(USER_KEY);
          window.location.href = "/auth/sign-in";
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return error.response;
  }
);
