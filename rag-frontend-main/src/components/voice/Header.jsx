import { AudioLines } from "lucide-react";
import StatusIndicator from "./StatusIndicator";

export default function Header({ status }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="mic-surface flex h-11 w-11 items-center justify-center rounded-2xl glow-primary">
          <AudioLines className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-[0.18em] text-foreground">VOICE RAG</h1>
          <p className="text-xs text-muted-foreground">
            Voice-Enabled Retrieval Augmented Generation
          </p>
        </div>
      </div>
      <StatusIndicator status={status} />
    </header>
  );
}
