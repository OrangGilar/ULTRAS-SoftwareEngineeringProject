import { api } from "./client";

/**
 * Wire shapes — match CommunityDtos.java on the backend exactly.
 *
 * Note the casing: backend serializes to camelCase via Jackson defaults, so
 * `clubId`, `authorClubId`, `viewerHasUpvoted` are all natural to use here.
 *
 * `authorId` was added so the frontend can decide whether to show the delete
 * button for a given thread or reply — compare it to the local userId from
 * useAuth().auth.userId.
 */

export type ApiThread = {
  id: string;
  clubId?: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorClubId?: string;
  upvotes: number;
  replyCount: number;
  createdAtISO: string;
  viewerHasUpvoted: boolean;
};

export type ApiReply = {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAtISO: string;
};

export type ApiThreadDetail = {
  thread: ApiThread;
  replies: ApiReply[];
};

export type ApiUpvoteResponse = {
  threadId: string;
  upvoteCount: number;
  viewerHasUpvoted: boolean;
};

export type CreateThreadPayload = {
  title: string;
  body: string;
  clubTag?: string;
  authorClubTag?: string;
};

export type CreateReplyPayload = {
  body: string;
};

// ---------- Reads ----------

/** GET /api/threads — public. Optional clubTag filter, default 20 results. */
export async function getThreads(params: { clubTag?: string; limit?: number } = {}): Promise<ApiThread[]> {
  const search = new URLSearchParams();
  if (params.clubTag) search.set("clubTag", params.clubTag);
  if (params.limit)   search.set("limit", String(params.limit));
  const qs = search.toString();
  const { data } = await api.get<ApiThread[]>(`/api/threads${qs ? `?${qs}` : ""}`);
  return data;
}

export async function getThread(id: string): Promise<ApiThreadDetail> {
  const { data } = await api.get<ApiThreadDetail>(`/api/threads/${encodeURIComponent(id)}`);
  return data;
}

// ---------- Writes ----------

export async function createThread(payload: CreateThreadPayload): Promise<ApiThread> {
  const { data } = await api.post<ApiThread>("/api/threads", payload);
  return data;
}

export async function deleteThread(id: string): Promise<void> {
  await api.delete(`/api/threads/${encodeURIComponent(id)}`);
}

export async function toggleUpvote(threadId: string): Promise<ApiUpvoteResponse> {
  const { data } = await api.post<ApiUpvoteResponse>(`/api/threads/${encodeURIComponent(threadId)}/upvote`);
  return data;
}

export async function createReply(threadId: string, payload: CreateReplyPayload): Promise<ApiReply> {
  const { data } = await api.post<ApiReply>(`/api/threads/${encodeURIComponent(threadId)}/replies`, payload);
  return data;
}

export async function deleteReply(threadId: string, replyId: string): Promise<void> {
  await api.delete(`/api/threads/${encodeURIComponent(threadId)}/replies/${encodeURIComponent(replyId)}`);
}