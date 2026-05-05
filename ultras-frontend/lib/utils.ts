type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (typeof v === "object") {
      for (const key of Object.keys(v)) {
        if (v[key]) out.push(key);
      }
    }
  };
  inputs.forEach(walk);
  return out.join(" ");
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  const day = DAYS[d.getDay()];
  const date = String(d.getDate()).padStart(2, "0");
  const month = MONTHS[d.getMonth()];
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day}, ${date} ${month}, ${h}:${m}`;
}

export function formatRelative(iso: string, nowIso?: string): string {
  const target = new Date(iso).getTime();
  const now = nowIso ? new Date(nowIso).getTime() : Date.now();
  const diff = target - now;
  const abs = Math.abs(diff);
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (abs < hr) return diff > 0 ? `in ${Math.round(abs / min)}m` : `${Math.round(abs / min)}m ago`;
  if (abs < day) return diff > 0 ? `in ${Math.round(abs / hr)}h` : `${Math.round(abs / hr)}h ago`;
  const days = Math.round(abs / day);
  return diff > 0 ? `in ${days}d` : `${days}d ago`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
