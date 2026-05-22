import { api, setStoredAuth } from "./client";

/**
 * Wire formats — these mirror the Spring Boot DTOs exactly:
 *   AuthResponse, RegisterRequest, LoginRequest
 */

export type AuthResponse = {
  token: string;
  userId: string;
  username: string;
  email: string;
  tier: "ROOKIE" | "FAN" | "ULTRAS" | "LEGEND";
  xpTotal: number;
};

export type RegisterPayload = {
  email: string;
  displayName: string;
  password: string;
  username?: string;   // optional — backend derives one from displayName if blank
  city?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

/**
 * POST /api/auth/register
 * On success, persists the JWT so subsequent requests authenticate automatically.
 * On failure, the response interceptor throws ApiError.
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
  setStoredAuth(data);
  return data;
}

/** POST /api/auth/login — same persistence behaviour as register(). */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
  setStoredAuth(data);
  return data;
}

/** Drops the locally-cached JWT. Server is stateless so no API call is needed. */
export function logout(): void {
  setStoredAuth(null);
}