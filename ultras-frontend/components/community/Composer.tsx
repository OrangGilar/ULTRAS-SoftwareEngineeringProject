"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createThread, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

/**
 * Composer for new threads. Posts to POST /api/threads and bubbles a refetch
 * up to the parent so the new thread appears at the top of the list.
 *
 * Anonymous users get bounced to /login on first interaction — composing a
 * thread without an account isn't supported.
 */
export function Composer({
  onPosted,
  defaultClubTag,
  authorClubTag,
}: {
  onPosted?: () => void;
  /** Optional: pre-tag the thread with the user's currently-filtered club. */
  defaultClubTag?: string;
  /** The author's stated club affiliation (from useLocalUser.clubId). */
  authorClubTag?: string;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tryOpen = () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || posting) return;

    setPosting(true);
    setErrorMsg(null);
    try {
      await createThread({
        title: title.trim(),
        body: body.trim(),
        clubTag: defaultClubTag,
        authorClubTag: authorClubTag,
      });
      setTitle("");
      setBody("");
      setOpen(false);
      onPosted?.();
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(String(err), 0);
      setErrorMsg(apiErr.status === 0 ? "Couldn't reach the server." : apiErr.message);
    } finally {
      setPosting(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={tryOpen}
        className="group flex w-full items-center gap-4 border-y border-[var(--color-line)] py-5 text-left transition hover:border-[var(--color-text)]"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-pure-white)]">
          <Plus size={16} />
        </span>
        <span className="font-display text-lg font-bold tracking-[-0.01em] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-text)]">
          {isAuthenticated ? "Start a discussion." : "Log in to start a discussion."}
        </span>
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border-y border-[var(--color-line)] py-6">
      <div className="space-y-2">
        <label className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind, supporter?"
          maxLength={200}
          className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 font-display text-xl font-bold tracking-[-0.01em] placeholder:text-[var(--color-text-faint)] placeholder:font-normal focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Take
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Be respectful. This is a stadium, not a comment war."
          rows={4}
          maxLength={4000}
          className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-sm placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      {errorMsg && (
        <p role="alert" className="font-mono-label text-[10px] text-[var(--color-primary)]">
          {errorMsg}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={posting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={posting}
          disabled={!title.trim() || !body.trim() || posting}
        >
          Post
        </Button>
      </div>
    </form>
  );
}
