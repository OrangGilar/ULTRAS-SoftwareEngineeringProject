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
        <Link href="/matches">
          <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back to fixtures</Button>
        </Link>
        <MatchHeader match={match} />
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            This match has finished. See your reveal.
          </p>
          <Link href={`/matches/${match.id}/result`} className="mt-3 inline-block">
            <Button>Open result</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/matches">
        <Button variant="ghost" leftIcon={<ChevronLeft size={16} />}>Back to fixtures</Button>
      </Link>
      <MatchHeader match={match} hideScore />
      <PredictionForm match={match} />
    </>
  );
}
