import axios from "axios";
import * as SecureStore from "expo-secure-store";

async function getToken() {
  return await SecureStore.getItemAsync("token");
}

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    let token = await getToken();
    if (!token) {
      token = localStorage.getItem("token") || "";
    }
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
