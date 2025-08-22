import axios from "axios";

async function getToken() {
  return localStorage.getItem("token") || "";
}

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.X_API_KEY
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    console.log("Current token:", token);
    if (config.headers && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export { getToken };
export default axiosClient;
