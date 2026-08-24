import { Mic, MicOff, Loader2, Check, AlertTriangle } from "lucide-react";

const LABELS = {
  idle: "Tap to speak",
  listening: "Listening…",
  processing: "Retrieving & generating…",
  success: "Ask another question",
  error: "Tap to try again",
};

export default function VoiceButton({ state = "idle", supported = true, onClick }) {
  const Icon =
    state === "listening"
      ? Mic
      : state === "processing"
        ? Loader2
        : state === "success"
          ? Check
          : state === "error"
            ? AlertTriangle
            : supported
              ? Mic
              : MicOff;

  const disabled = state === "processing" || !supported;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        {state === "listening" && (
          <>
            <span className="animate-ring absolute h-32 w-32 rounded-full border border-primary/60 sm:h-36 sm:w-36" />
            <span
              className="animate-ring absolute h-32 w-32 rounded-full border border-accent/50 sm:h-36 sm:w-36"
              style={{ animationDelay: "0.7s" }}
            />
            <span
              className="animate-ring absolute h-32 w-32 rounded-full border border-primary/40 sm:h-36 sm:w-36"
              style={{ animationDelay: "1.4s" }}
            />
          </>
        )}
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={supported ? LABELS[state] : "Voice input unsupported"}
          className={`mic-surface relative flex h-28 w-28 items-center justify-center rounded-full text-primary-foreground transition-all duration-300 sm:h-32 sm:w-32
            ${state === "idle" || state === "success" ? "animate-breathe hover:scale-105" : ""}
            ${state === "listening" ? "scale-110 glow-primary" : ""}
            ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer active:scale-95"}`}
        >
          <Icon className={`h-10 w-10 ${state === "processing" ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="text-sm font-medium text-muted-foreground">
        {supported ? LABELS[state] : "Voice input unavailable — type below"}
      </p>
    </div>
  );
}
