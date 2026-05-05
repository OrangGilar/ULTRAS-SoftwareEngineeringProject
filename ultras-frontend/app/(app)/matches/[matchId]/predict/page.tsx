import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatch } from "@/lib/mock/matches";
import { MatchHeader } from "@/components/match/MatchHeader";
import { PredictionForm } from "@/components/match/PredictionForm";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default async function PredictPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const match = getMatch(matchId);
  if (!match) notFound();

  if (match.status === "finished") {
    return (
      <>
        <Link href="/matches" className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
          <ChevronLeft size={14} />
          Back to fixtures
        </Link>
        <MatchHeader match={match} />
        <div className="border-y border-[var(--color-line)] py-10 text-center">
          <p className="prose-line mx-auto text-base text-[var(--color-text-muted)]">
            This match has finished. See your reveal.
          </p>
          <Link href={`/matches/${match.id}/result`} className="mt-5 inline-block">
            <Button>Open result</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/matches" className="inline-flex items-center gap-1 font-mono-label text-[10px] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]">
        <ChevronLeft size={14} />
        Back to fixtures
      </Link>
      <MatchHeader match={match} hideScore />
      <PredictionForm match={match} />
    </>
  );
}
