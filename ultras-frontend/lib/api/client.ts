import axios, { AxiosError, type AxiosInstance } from "axios";



const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const TOKEN_STORAGE_KEY = "ultras:auth:v1";

// ---------- Token persistence (browser-only) ----------

type StoredAuth = {
  token: string;
  userId: string;
  username: string;
  email: string;
  tier: string;
  xpTotal: number;
};

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth | null): void {
  if (typeof window === "undefined") return;
  if (auth === null) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(auth));
  }
}

// ---------- Errors ----------

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function toApiError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    // Server responded with non-2xx
    if (err.response) {
      const data = err.response.data as
        | { message?: string; fieldErrors?: Record<string, string> }
        | undefined;
      return new ApiError(
        data?.message ?? err.response.statusText ?? "Request failed",
        err.response.status,
        data?.fieldErrors,
      );
    }
    // Request fired but no response (CORS preflight rejected, server down, network drop)
    if (err.request) {
      return new ApiError(
        "Couldn't reach the server. Check your network and that the backend is running.",
        0,
      );
    }
    // Setup error (bad URL, etc.)
    return new ApiError(err.message, 0);
  }
  return new ApiError(err instanceof Error ? err.message : String(err), 0);
}

// ---------- The instance ----------

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
  // Don't throw on 3xx — we don't expect any from this backend, but if a redirect
  // ever shows up we want to see it instead of swallowing it as an error.
  validateStatus: (s) => s >= 200 && s < 300,
});

api.interceptors.request.use((config) => {
  const stored = getStoredAuth();
  if (stored?.token) {
    config.headers.set("Authorization", `Bearer ${stored.token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(toApiError(err)),
);