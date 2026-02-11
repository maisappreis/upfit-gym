import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PREFIX = "/upfit/test";

export const apiClient = axios.create({
  baseURL: `${API_BASE}${API_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const { data } = await apiClient.post("/token/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem("accessToken", data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
