import { Quote } from "lucide-react";

export default function Transcript({ text, live = false }) {
  if (!text) return null;
  return (
    <div className="animate-rise glass mx-auto flex max-w-2xl items-start gap-3 rounded-2xl px-5 py-4">
      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {live ? "Listening" : "You said"}
        </p>
        <p className="mt-1 text-base text-foreground">{text}</p>
      </div>
    </div>
  );
}
