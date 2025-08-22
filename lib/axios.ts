import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { EXPO_BASE_PUBLIC_API } from '@env'
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

const axiosClient = axios.create({
  baseURL: EXPO_BASE_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  let token = await getToken();
  console.log("Current token:", token);
  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

export default axiosClient;
