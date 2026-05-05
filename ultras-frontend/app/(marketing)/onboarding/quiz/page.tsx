"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions } from "@/lib/mock/quiz";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizStep } from "@/components/quiz/QuizStep";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

const STORAGE_KEY = "ultras:quiz:answers:v1";

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = quizQuestions.length;
  const current = quizQuestions[step];
  const selected = current ? answers[current.id] : undefined;

  const goNext = () => {
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          Object.entries(answers).map(([questionId, choiceId]) => ({ questionId, choiceId }))
        )
      );
    }
    router.push("/onboarding/result");
  };

  return (
    <div className="space-y-10">
      <QuizProgress step={step + 1} total={total} />

      {current && (
        <QuizStep
          question={current}
          selected={selected}
          onSelect={(choiceId) => {
            setAnswers((prev) => ({ ...prev, [current.id]: choiceId }));
          }}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft size={16} />}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button onClick={goNext} disabled={!selected}>
          {step < total - 1 ? "Next" : "See my club"}
        </Button>
      </div>
    </div>
  );
}
