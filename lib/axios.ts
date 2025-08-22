import axios from "axios";

function getToken() {
  try {
    return (typeof window !== "undefined" && window.localStorage.getItem("token")) || "";
  } catch {
    return "";
  }
}

const resolvedBase = (() => {
  try {
    const env = (process.env.EXPO_PUBLIC_BASE_URL || "").trim();
    if (env) return env.replace(/\/+$/, "");
    if (typeof window !== "undefined") return `${window.location.origin}/api`;
    return "/api";
  } catch {
    return "/api";
  }
})();

const axiosClient = axios.create({
  baseURL: resolvedBase,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": (process.env.EXPO_PUBLIC_X_API_KEY || process.env.X_API_KEY) as any,
  },
});

// In-memory token to avoid async storage lookup in interceptors (esp. native)
let currentToken: string | null = null;

/**
 * Set or clear the Authorization header globally and keep an in-memory token.
 * Also mirrors to localStorage on web for persistence.
 */
function setAuthToken(token: string | null) {
  currentToken = token;
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      if (typeof window !== "undefined") window.localStorage.setItem("token", token);
    } catch {}
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("id");
      }
    } catch {}
  }
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = currentToken || getToken();
    if (config.headers && token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global auth guard: on 401/403, clear tokens and redirect to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        // Clear tokens
        setAuthToken(null);
        if (typeof window !== "undefined") {
          const loginPath = "/(web)/(admin)/login";
          if (window.location.pathname !== loginPath) {
            window.location.href = loginPath;
          }
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);

export { getToken, setAuthToken };
export default axiosClient;
