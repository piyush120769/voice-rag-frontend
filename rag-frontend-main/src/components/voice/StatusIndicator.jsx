import { Wifi, WifiOff, Loader2 } from "lucide-react";

export default function StatusIndicator({ status }) {
  const map = {
    checking: {
      label: "Checking API…",
      Icon: Loader2,
      dot: "bg-muted-foreground",
      tone: "text-muted-foreground",
      spin: true,
    },
    online: { label: "API Connected", Icon: Wifi, dot: "bg-accent", tone: "text-accent" },
    offline: { label: "API Offline", Icon: WifiOff, dot: "bg-destructive", tone: "text-destructive" },
  };
  const { label, Icon, dot, tone, spin } = map[status] ?? map.checking;

  return (
    <div className="glass flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors duration-500">
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dot} opacity-70`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      <Icon className={`h-3.5 w-3.5 ${tone} ${spin ? "animate-spin" : ""}`} />
      <span className={`text-xs font-medium tracking-wide ${tone}`}>{label}</span>
    </div>
  );
}
