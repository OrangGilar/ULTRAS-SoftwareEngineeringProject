"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function Composer({ onPosted }: { onPosted?: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-4 border-y border-[var(--color-line)] py-5 text-left transition hover:border-[var(--color-text)]"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--color-pure-white)]">
          <Plus size={16} />
        </span>
        <span className="font-display text-lg font-bold tracking-[-0.01em] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-text)]">
          Start a discussion.
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-5 border-y border-[var(--color-line)] py-6">
      <div className="space-y-2">
        <label className="font-mono-label text-[10px] text-[var(--color-text-faint)]">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind, supporter?"
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
          className="w-full border-0 border-b border-[var(--color-line-strong)] bg-transparent px-0 py-2 text-sm placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          loading={posting}
          disabled={!title.trim() || !body.trim()}
          onClick={() => {
            setPosting(true);
            setTimeout(() => {
              setPosting(false);
              setOpen(false);
              setTitle("");
              setBody("");
              onPosted?.();
            }, 600);
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
