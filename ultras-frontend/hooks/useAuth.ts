"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getStoredAuth,
  setStoredAuth,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  type AuthResponse,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

/**
 * Reactive wrapper around the JWT persisted in localStorage. Components that
 * call login/register get a fresh `auth` value back through useSyncExternalStore
 * without prop drilling.
 *
 * This is intentionally separate from useLocalUser — auth identity (who you are
 * to the server) is a different concern from user preferences (predictions,
 * cosmetics, points). Mixing them made the storage migration painful last time.
 */

const STORAGE_KEY = "ultras:auth:v1";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Cross-tab sync: if the user logs in/out in another tab, this one notices.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
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

function getServerSnapshot(): AuthResponse | null {
  return null; // SSR sees logged-out state; client hydrates with the real value.
}

export function useAuth() {
  const auth = useSyncExternalStore(subscribe, getStoredAuth, getServerSnapshot);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    notify();
    return res;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await apiRegister(payload);
    notify();
    return res;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    notify();
  }, []);

  // Manual setter for unusual flows (e.g. token refresh, social login callback).
  const setAuth = useCallback((next: AuthResponse | null) => {
    setStoredAuth(next);
    notify();
  }, []);

  return {
    auth,
    isAuthenticated: !!auth,
    login,
    register,
    logout,
    setAuth,
  };
}