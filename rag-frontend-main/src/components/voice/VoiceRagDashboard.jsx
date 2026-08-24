import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Mic, AlertCircle, Layers } from "lucide-react";
import Header from "./Header";
import VoiceButton from "./VoiceButton";
import Transcript from "./Transcript";
import AnswerCard from "./AnswerCard";
import SourceCard from "./SourceCard";
import PerformanceCard from "./PerformanceCard";
import { askQuestion, checkHealth } from "@/services/api";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function VoiceRagDashboard() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [micState, setMicState] = useState("idle");
  const answerRef = useRef(null);

  const speech = useSpeechSynthesis();

  const runQuery = useCallback(async (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) {
      setError("Please speak or enter a question.");
      setMicState("error");
      return;
    }
    setQuestion(trimmed);
    setError(null);
    setResult(null);
    setLoading(true);
    setMicState("processing");
    try {
      const data = await askQuestion(trimmed);
      setResult(data);
      setMicState("success");
      setApiStatus("online");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setMicState("error");
      if (err.code === "NETWORK_ERROR") setApiStatus("offline");
    } finally {
      setLoading(false);
    }
  }, []);

  const recognition = useSpeechRecognition({ onResult: runQuery });

  useEffect(() => {
    if (recognition.listening) setMicState("listening");
    else if (micState === "listening") setMicState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognition.listening]);

  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      try {
        await checkHealth();
        if (!cancelled) setApiStatus("online");
      } catch {
        if (!cancelled) setApiStatus("offline");
      }
    };
    ping();
    const id = setInterval(ping, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (result && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const activeError = error || recognition.error;
  const hasConversation = Boolean(question);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1150px]">
        <Header status={apiStatus} />

        <main className="mt-12 sm:mt-16">
          <section className="text-center">
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-5xl">
              Ask your knowledge base.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Speak naturally. Get grounded answers powered by Retrieval-Augmented Generation.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {["Speak", "Transcribe", "Retrieve", "Generate", "Answer", "Listen"].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  {i > 0 && <span className="text-primary/60">→</span>}
                  <span className="rounded-full border border-border px-3 py-1">{step}</span>
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10 flex flex-col items-center gap-6">
            <VoiceButton
              state={loading ? "processing" : micState}
              supported={recognition.supported}
              onClick={recognition.toggle}
            />

            <Transcript
              text={recognition.listening ? recognition.interim : ""}
              live
            />

            <form
              className="glass flex w-full max-w-2xl items-center gap-2 rounded-full p-2"
              onSubmit={(e) => {
                e.preventDefault();
                runQuery(input);
                setInput("");
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Or type your question here..."
                aria-label="Type your question"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={loading}
                className="mic-surface flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            {activeError && (
              <div className="animate-rise flex max-w-2xl items-start gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{activeError}</span>
              </div>
            )}
          </section>

          <div ref={answerRef} className="mt-12">
            {!hasConversation && !loading && (
              <div className="glass mx-auto max-w-xl rounded-3xl px-8 py-12 text-center">
                <Mic className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-4 font-display text-lg font-semibold text-foreground">
                  Your knowledge base is ready.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask a question using your voice or type it below.
                </p>
              </div>
            )}

            {hasConversation && (
              <div className="space-y-5">
                <div className="flex justify-end">
                  <div className="animate-rise max-w-[85%] rounded-3xl rounded-br-md bg-secondary px-5 py-3 text-sm text-secondary-foreground sm:max-w-[70%]">
                    {question}
                  </div>
                </div>

                {loading && (
                  <div className="glass animate-rise flex items-center gap-3 rounded-3xl px-6 py-5 text-sm text-muted-foreground">
                    <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
                    Retrieving context and generating your answer…
                  </div>
                )}

                {result && (
                  <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-5">
                      <AnswerCard
                        answer={result.answer}
                        speaking={speech.speaking}
                        canSpeak={speech.supported}
                        onSpeak={speech.speak}
                        onStop={speech.stop}
                      />

                      {result.sources.length > 0 && (
                        <section className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-accent" />
                            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                              Retrieved Sources
                            </h2>
                            <span className="text-xs text-muted-foreground">
                              ({result.sources.length})
                            </span>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {result.sources.map((source, i) => (
                              <SourceCard
                                key={i}
                                index={i + 1}
                                text={source.text}
                                score={source.score}
                                delay={i * 90}
                              />
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    <PerformanceCard timings={result.timings} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="mt-16 pb-6 text-center text-xs text-muted-foreground">
          Voice RAG · answers grounded in your indexed knowledge base
        </footer>
      </div>
    </div>
  );
}
