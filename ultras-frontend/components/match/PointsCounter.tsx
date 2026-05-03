"use client";

import { useEffect, useRef, useState } from "react";

export type PointsCounterProps = {
  to: number;
  durationMs?: number;
  className?: string;
  format?: (n: number) => string;
  onComplete?: () => void;
};

export function PointsCounter({
  to,
  durationMs = 1200,
  className,
  format,
  onComplete,
}: PointsCounterProps) {
  const [n, setN] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        ref.current = raf;
      } else {
        onComplete?.();
      }
    };
    raf = requestAnimationFrame(tick);
    ref.current = raf;
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [to, durationMs, onComplete]);

  return (
    <span className={className} aria-live="polite">
      {format ? format(n) : n.toLocaleString()}
    </span>
  );
}
