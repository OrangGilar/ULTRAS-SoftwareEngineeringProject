export { api, ApiError, getStoredAuth, setStoredAuth } from "./client";
export { login, logout, register } from "./auth";
export type { AuthResponse, LoginPayload, RegisterPayload } from "./auth";
export { getMatches, getLiveMatches, getMatch, forceSyncMatches } from "./matches";
export type { ApiMatch } from "./matches";