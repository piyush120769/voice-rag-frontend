export default function SourceCard({ index, text, score, delay = 0 }) {
  const pct = Math.max(0, Math.min(1, Number(score) || 0)) * 100;
  return (
    <article
      className="animate-rise glass rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent">
          Source {index}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          Similarity: {Number(score ?? 0).toFixed(4)}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="mic-surface h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="scrollbar-slim mt-3 max-h-40 overflow-y-auto text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </article>
  );
}
