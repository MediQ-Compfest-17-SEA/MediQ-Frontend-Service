// utils/storage.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

// Convenience helpers for auth-related storage

export async function getToken() {
  return await storage.getItem("token");
}

export async function setToken(token: string) {
  await storage.setItem("token", token);
}

export async function getRefreshToken() {
  return await storage.getItem("refreshToken");
}

export async function setRefreshToken(token: string) {
  await storage.setItem("refreshToken", token);
}

export async function getId() {
  return await storage.getItem("id");
}

export async function setId(id: string) {
  await storage.setItem("id", id);
}

export async function clearAuth() {
  await storage.removeItem("token");
  await storage.removeItem("refreshToken");
  await storage.removeItem("id");
}

export async function clearAll() {
  try {
    if (Platform.OS === "web") {
      localStorage.clear();
    } else {
      await clearAuth();
    }
  } catch {
    // no-op
  }
}
