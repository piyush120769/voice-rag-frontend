const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");


/* =========================================
   GET API BASE URL
========================================= */

export const getApiUrl = () => API_URL;


/* =========================================
   HEALTH CHECK
   GET /health
========================================= */

export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Health check failed (${res.status})`);
    }

    return await res.json().catch(() => ({}));

  } catch (error) {

    if (error.message?.includes("Health check failed")) {
      throw error;
    }

    const err = new Error(
      "Unable to connect to Voice RAG API."
    );

    err.code = "NETWORK_ERROR";

    throw err;
  }
}


/* =========================================
   ASK QUESTION
   POST /ask
========================================= */

export async function askQuestion(question) {

  const trimmed = (question || "").trim();


  /* Empty question */

  if (!trimmed) {

    const err = new Error(
      "Please speak or enter a question."
    );

    err.code = "EMPTY_QUESTION";

    throw err;
  }


  /* Start latency timer */

  const started = performance.now();

  let res;


  /* =========================================
     SEND REQUEST
  ========================================= */

  try {

    res = await fetch(`${API_URL}/ask`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question: trimmed,
      }),

    });

  } catch (error) {

    const err = new Error(
      "Unable to connect to Voice RAG API."
    );

    err.code = "NETWORK_ERROR";

    throw err;
  }


  /* =========================================
     API ERROR
  ========================================= */

  if (!res.ok) {

    const detail = await res
      .text()
      .catch(() => "");

    const err = new Error(
      `Voice RAG API returned an error (${res.status}).` +
      `${detail ? ` ${detail.slice(0, 160)}` : ""}`
    );

    err.code = "API_ERROR";

    throw err;
  }


  /* =========================================
     PARSE RESPONSE
  ========================================= */

  let data;

  try {

    data = await res.json();

  } catch (error) {

    const err = new Error(
      "Received an invalid response from the API."
    );

    err.code = "PARSE_ERROR";

    throw err;
  }


  /* =========================================
     CALCULATE LATENCY
  ========================================= */

  const totalMs = Math.round(
    performance.now() - started
  );


  /* =========================================
     RETURN FINAL RESPONSE
  ========================================= */

  return {

    question:
      data.question ?? trimmed,

    answer:
      data.answer ?? "",

    sources:
      Array.isArray(data.sources)
        ? data.sources
        : [],

    timings: {

      retrievalMs:
        data.retrieval_time_ms ??
        data.retrieval_ms ??
        null,

      generationMs:
        data.generation_time_ms ??
        data.generation_ms ??
        null,

      totalMs:
        data.total_time_ms ??
        data.latency_ms ??
        totalMs,

      clientTotalMs:
        totalMs,
    },

  };
}