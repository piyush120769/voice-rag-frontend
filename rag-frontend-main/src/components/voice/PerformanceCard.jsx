import { Zap } from "lucide-react";

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-secondary/50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

const ms = (v) => (typeof v === "number" ? `${Math.round(v)} ms` : null);

export default function PerformanceCard({ timings }) {
  if (!timings) return null;
  return (
    <section className="animate-rise glass rounded-3xl p-5">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-accent" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
          Response Time
        </h2>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-foreground">
        {ms(timings.totalMs) ?? "—"}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="Retrieval" value={ms(timings.retrievalMs)} />
        <Metric label="Generation" value={ms(timings.generationMs)} />
        <Metric label="Total" value={ms(timings.totalMs)} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 opacity-60">
        <Metric label="P50" value={ms(timings.p50)} />
        <Metric label="P70" value={ms(timings.p70)} />
        <Metric label="P100" value={ms(timings.p100)} />
      </div>
    </section>
  );
}
