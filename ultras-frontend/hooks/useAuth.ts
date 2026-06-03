"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getStoredAuth,
  setStoredAuth,
  forgotPassword as apiForgotPassword,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  type AuthResponse,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

const STORAGE_KEY = "ultras:auth:v1";

const listeners = new Set<() => void>();



let cachedRaw: string | null = null;
let cachedAuth: AuthResponse | null = null;

function getCachedSnapshot(): AuthResponse | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedAuth;

  cachedRaw = raw;
  cachedAuth = raw ? (() => {
    try { return JSON.parse(raw) as AuthResponse; } catch { return null; }
  })() : null;
  return cachedAuth;
}

/** Force the next getCachedSnapshot() call to re-read and re-parse. */
function invalidate() {
  cachedRaw = null;
  cachedAuth = null;
}

// ---------- Subscription ----------

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      invalidate();
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function notifyAll() {
  listeners.forEach((l) => l());
}

function getServerSnapshot(): AuthResponse | null {
  // SSR / pre-hydration: always logged-out. Stable null is fine.
  return null;
}

// ---------- Hook ----------

export function useAuth() {
  const auth = useSyncExternalStore(subscribe, getCachedSnapshot, getServerSnapshot);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    invalidate();
    notifyAll();
    return res;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await apiRegister(payload);
    invalidate();
    notifyAll();
    return res;
  }, []);

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    await apiForgotPassword(payload);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    invalidate();
    notifyAll();
  }, []);

  const setAuth = useCallback((next: AuthResponse | null) => {
    setStoredAuth(next as Parameters<typeof setStoredAuth>[0]);
    invalidate();
    notifyAll();
  }, []);

  return {
    auth,
    isAuthenticated: !!auth,
    login,
    register,
    forgotPassword,
    logout,
    setAuth,
  };
}

// `getStoredAuth` is still used by the axios interceptor in lib/api/client.ts —
// that path doesn't go through React, so the un-cached version is fine there.
// We export it here only so this module also has access if needed.
export { getStoredAuth };
