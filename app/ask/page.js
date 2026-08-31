"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  "Why is Tanya Sethi high risk?",
  "Show me the most dangerous network cluster",
  "Which entities share suspicious devices?",
  "What are the emerging threats right now?",
];

const ANSWERS = {
  "Why is Tanya Sethi high risk?":
    "Tanya Sethi currently has a critical risk profile. The strongest contributing signals are device sharing, network exposure, transaction velocity, and behavioural anomalies. Her network also contains multiple high-risk entities, increasing the likelihood of coordinated activity.",

  "Show me the most dangerous network cluster":
    "The highest-priority cluster currently centres around DEV-0001. It connects multiple customers and a high-risk beneficiary, creating a concentrated network exposure pattern. Tanya Sethi and Aditya Verma are among the entities requiring immediate investigation.",

  "Which entities share suspicious devices?":
    "DEV-0001 is currently associated with Tanya Sethi and Aditya Verma. DEV-0003 is connected to Arjun Shah and other elevated-risk activity. Shared device relationships are treated as an important network signal.",

  "What are the emerging threats right now?":
    "Veyra currently identifies four emerging patterns: a critical shared-device cluster, beneficiary concentration, cross-account behavioural shifts, and dormant-account reactivation. The shared-device cluster has the fastest growth rate.",
};

function generateAnswer(question) {
  const normalized = question.toLowerCase();

  if (
    normalized.includes("tanya") ||
    normalized.includes("high risk")
  ) {
    return ANSWERS["Why is Tanya Sethi high risk?"];
  }

  if (
    normalized.includes("cluster") ||
    normalized.includes("dangerous")
  ) {
    return ANSWERS["Show me the most dangerous network cluster"];
  }

  if (
    normalized.includes("device") ||
    normalized.includes("share")
  ) {
    return ANSWERS["Which entities share suspicious devices?"];
  }

  if (
    normalized.includes("threat") ||
    normalized.includes("emerging")
  ) {
    return ANSWERS["What are the emerging threats right now?"];
  }

  return `Veyra analysed the question against the available risk and network intelligence. The strongest relevant signals indicate elevated network exposure and behavioural anomalies. I recommend opening the Risk Network and investigating the highest-risk connected entities for additional evidence.`;
}

export default function AskPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);

  async function askVeyra(text = question) {
    const trimmed = text.trim();

    if (!trimmed || thinking) return;

    setQuestion("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmed,
      },
    ]);

    setThinking(true);

    await new Promise((resolve) => setTimeout(resolve, 650));

    const answer = generateAnswer(trimmed);

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: answer,
      },
    ]);

    setThinking(false);
  }

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-6 py-8 lg:px-10">

        {/* HEADER */}

        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-500 transition hover:text-white"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            VEYRA INTELLIGENCE ENGINE
            <span>•</span>
            ONLINE
          </div>
        </div>

        {/* HERO */}

        {messages.length === 0 && (
          <section className="flex flex-1 flex-col items-center justify-center py-20">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-900/50 bg-emerald-950/20 text-2xl text-emerald-400">
              V
            </div>

            <p className="mt-7 text-xs font-semibold tracking-[0.3em] text-emerald-400">
              INVESTIGATION COPILOT
            </p>

            <h1 className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-5xl">
              Ask Veyra
            </h1>

            <p className="mt-5 max-w-2xl text-center text-sm leading-7 text-slate-500">
              Ask questions about entities, risk patterns, network
              relationships and emerging threats.
            </p>

            <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => askVeyra(suggestion)}
                  className="rounded-2xl border border-slate-800 bg-[#090d12] p-4 text-left text-sm text-slate-400 transition hover:border-emerald-900 hover:text-white"
                >
                  <span className="text-emerald-400">→</span>{" "}
                  {suggestion}
                </button>
              ))}
            </div>

          </section>
        )}

        {/* CHAT */}

        {messages.length > 0 && (
          <section className="flex-1 py-10">

            <div className="mx-auto max-w-3xl space-y-7">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-md bg-emerald-400 px-5 py-4 text-sm leading-6 text-black"
                        : "max-w-[90%] rounded-2xl rounded-bl-md border border-slate-800 bg-[#090d12] px-5 py-4 text-sm leading-7 text-slate-300"
                    }
                  >
                    {message.role === "assistant" && (
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        VEYRA
                      </div>
                    )}

                    {message.content}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-slate-800 bg-[#090d12] px-5 py-4 text-sm text-slate-500">
                    <span className="text-emerald-400">
                      Veyra
                    </span>{" "}
                    is analysing the available evidence...
                  </div>
                </div>
              )}

            </div>

          </section>
        )}

        {/* INPUT */}

        <section className="mx-auto w-full max-w-3xl pb-5">

          <form
            onSubmit={(event) => {
              event.preventDefault();
              askVeyra();
            }}
            className="rounded-2xl border border-slate-700 bg-[#090d12] p-2 shadow-2xl shadow-black/30"
          >
            <div className="flex items-end gap-3">

              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    askVeyra();
                  }
                }}
                placeholder="Ask Veyra about a risk, entity or network..."
                rows={2}
                className="min-h-[56px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />

              <button
                type="submit"
                disabled={!question.trim() || thinking}
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Ask →
              </button>

            </div>
          </form>

          <div className="mt-3 flex justify-between px-2 text-[10px] text-slate-700">
            <span>Veyra Investigation Copilot</span>
            <span>Enter to send · Shift + Enter for new line</span>
          </div>

        </section>

      </div>
    </main>
  );
}
