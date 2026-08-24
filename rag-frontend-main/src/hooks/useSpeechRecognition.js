import { useCallback, useEffect, useRef, useState } from "react";

function getRecognitionCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechRecognition({ onResult } = {}) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    setSupported(Boolean(getRecognitionCtor()));
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* noop */
      }
    };
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      setError("Voice input isn't supported in this browser. You can type your question instead.");
      return;
    }
    setError(null);
    setInterim("");

    try {
      recognitionRef.current?.abort();
    } catch {
      /* noop */
    }

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let live = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript;
        else live += result[0].transcript;
      }
      setInterim(live || finalTranscript);
    };

    recognition.onerror = (event) => {
      setListening(false);
      const code = event?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError("Microphone access is required. Please allow microphone permission.");
      } else if (code === "no-speech") {
        setError("I didn't catch that. Please try speaking again.");
      } else if (code === "audio-capture") {
        setError("No microphone was found. Connect one and try again.");
      } else if (code !== "aborted") {
        setError("Speech recognition failed. Please try again or type your question.");
      }
    };

    recognition.onend = () => {
      setListening(false);
      const text = finalTranscript.trim();
      setInterim("");
      if (text) onResultRef.current?.(text);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
      setError("Could not start listening. Please try again.");
    }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { supported, listening, interim, error, start, stop, toggle, clearError: () => setError(null) };
}
