import { createFileRoute } from "@tanstack/react-router";
import VoiceRagDashboard from "@/components/voice/VoiceRagDashboard";

const title = "Voice RAG — Ask Your Knowledge Base by Voice";
const description =
  "Speak a question and get grounded answers with retrieved sources, similarity scores, and latency from your Retrieval-Augmented Generation backend.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceRagDashboard,
});
