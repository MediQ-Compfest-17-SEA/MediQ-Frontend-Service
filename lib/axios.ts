import axios from "axios";
import * as SecureStore from "expo-secure-store";

async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log("Current token:", token);
  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

export default axiosClient;
