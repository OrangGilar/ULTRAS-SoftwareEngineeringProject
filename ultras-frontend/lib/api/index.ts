export { api, ApiError, getStoredAuth, setStoredAuth } from "./client";
export { login, logout, register } from "./auth";
export type { AuthResponse, LoginPayload, RegisterPayload } from "./auth";
export { getMatches, getLiveMatches, getMatch, forceSyncMatches } from "./matches";
export type { ApiMatch } from "./matches";
export { getStandings, getTeamStanding, getTeamMatches } from "./standings";
export {
  getThreads,
  getThread,
  createThread,
  deleteThread,
  toggleUpvote,
  createReply,
  deleteReply,
} from "./community";
export type {
  ApiThread,
  ApiReply,
  ApiThreadDetail,
  ApiUpvoteResponse,
  CreateThreadPayload,
  CreateReplyPayload,
} from "./community";