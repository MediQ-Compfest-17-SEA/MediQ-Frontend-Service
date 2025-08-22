import axios from "axios";
import { storage } from "@/utils/storage";

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "my-very-strong-api-key"
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    let token = await storage.getItem("token");
    console.log("Current token:", token);
    if (config.headers) {
      config.headers.Authorization = token ? `Bearer ${token}` : "";
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
