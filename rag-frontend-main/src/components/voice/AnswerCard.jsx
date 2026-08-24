import { Sparkles, Volume2, Square } from "lucide-react";

export default function AnswerCard({ answer, speaking, canSpeak, onSpeak, onStop }) {
  return (
    <section className="animate-rise glass rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            AI Answer
          </h2>
        </div>
        {canSpeak && (
          <button
            type="button"
            onClick={speaking ? onStop : () => onSpeak(answer)}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-medium text-secondary-foreground transition-all duration-200 hover:border-primary hover:text-primary"
          >
            {speaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {speaking ? "Stop" : "Listen"}
          </button>
        )}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
        {answer || "The backend returned an empty answer."}
      </p>
    </section>
  );
}
