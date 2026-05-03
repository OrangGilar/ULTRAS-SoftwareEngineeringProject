"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
        className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-left text-sm text-[var(--color-text-muted)] transition hover:border-[var(--color-surface-3)] hover:text-[var(--color-text)]"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary)] text-white">+</span>
        Start a discussion…
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's on your mind, supporter?"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add your take. Be respectful — this is a stadium, not a comment war."
        rows={4}
        className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3 text-sm placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none"
      />
      <div className="flex justify-end gap-2">
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
