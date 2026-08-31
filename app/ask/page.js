"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  "Why is Tanya Sethi high risk?",
  "Who has the highest risk?",
  "Who is connected to DEV-0001?",
  "Show me the most dangerous network cluster",
  "What are the emerging threats?",
];

function formatIntent(intent) {
  if (!intent) return "GENERAL INTELLIGENCE";

  return intent
    .replaceAll("_", " ")
    .toUpperCase();
}

function riskLabel(score) {
  if (score >= 85) return "CRITICAL";
  if (score >= 75) return "HIGH";
  if (score >= 50) return "ELEVATED";
  return "LOW";
}

function riskClass(score) {
  if (score >= 85) return "border-red-500/20 bg-red-500/10 text-red-300";
  if (score >= 75) return "border-orange-500/20 bg-orange-500/10 text-orange-300";
  if (score >= 50) return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

export default function AskPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");

  async function askVeyra(text = question) {
    const trimmed = text.trim();

    if (!trimmed || thinking) return;

    setQuestion("");
    setError("");

    const messageId = `message-${messages.length}-${trimmed.length}`;

    setMessages((current) => [
      ...current,
      {
        id: messageId,
        role: "user",
        content: trimmed,
      },
    ]);

    setThinking(true);

    try {
      const response = await fetch("/api/intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Veyra Intelligence failed to respond."
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: `${messageId}-answer`,
          role: "assistant",
          content: data.answer,
          intent: data.intent,
          evidence: data.evidence || [],
          entity: data.entity || null,
          entities: data.entities || [],
          connections: data.connections || [],
          timestamp: data.timestamp,
        },
      ]);
    } catch (err) {
      console.error("Ask Veyra error:", err);
      setError(
        err.message ||
          "Unable to reach Veyra Intelligence. Make sure the server is running."
      );
    } finally {
      setThinking(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    askVeyra();
  }

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1250px] flex-col px-5 py-7 sm:px-8 lg:px-10">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-500 transition hover:text-white"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3 text-[11px] tracking-wide text-slate-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            VEYRA INTELLIGENCE ENGINE
            <span>•</span>
            ONLINE
          </div>
        </div>

        {/* HERO */}
        <section className="mx-auto mt-16 w-full max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xl text-emerald-300">
            ✦
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">
            Intelligence Layer
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Ask Veyra
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Query risk, network relationships and emerging threats using
            Veyra&apos;s live intelligence layer.
          </p>
        </section>

        {/* SUGGESTIONS */}
        {messages.length === 0 && (
          <div className="mx-auto mt-12 w-full max-w-4xl">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate-600">
              Try asking
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => askVeyra(suggestion)}
                  className="rounded-xl border border-white/[0.07] bg-[#0a0d12] px-4 py-3 text-left text-sm text-slate-400 transition hover:border-emerald-400/20 hover:bg-[#0d1117] hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONVERSATION */}
        {messages.length > 0 && (
          <div className="mx-auto mt-10 w-full max-w-4xl space-y-6">
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-br-md border border-white/[0.06] bg-[#10141b] px-5 py-4 text-sm leading-6 text-slate-200">
                      {message.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={message.id}
                  className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0d12]"
                >
                  {/* ANSWER HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                        ✦
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-white">
                          Veyra Intelligence
                        </div>

                        <div className="mt-0.5 text-[10px] text-slate-600">
                          Evidence-backed analysis
                        </div>
                      </div>
                    </div>

                    <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1 text-[10px] font-medium tracking-wide text-emerald-300">
                      {formatIntent(message.intent)}
                    </span>
                  </div>

                  {/* ANSWER */}
                  <div className="px-5 py-5">
                    <p className="text-sm leading-7 text-slate-300">
                      {message.content}
                    </p>
                  </div>

                  {/* ENTITY */}
                  {message.entity && (
                    <div className="border-t border-white/[0.06] px-5 py-4">
                      <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-600">
                        Entity analysed
                      </div>

                      <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#070a0e] p-4 sm:flex-row sm:items-center">
                        <div>
                          <div className="font-medium text-white">
                            {message.entity.name}
                          </div>

                          <div className="mt-1 text-xs text-slate-600">
                            {message.entity.id} · {message.entity.type}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${riskClass(
                              message.entity.risk
                            )}`}
                          >
                            {riskLabel(message.entity.risk)}{" "}
                            {message.entity.risk}/100
                          </span>

                          <button
                            onClick={() =>
                              router.push(
                                `/investigate/${message.entity.id}`
                              )
                            }
                            className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-emerald-300"
                          >
                            Investigate →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ENTITIES */}
                  {message.entities?.length > 0 && (
                    <div className="border-t border-white/[0.06] px-5 py-4">
                      <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-600">
                        Entities detected
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {message.entities.map((entity) => (
                          <button
                            key={entity.id}
                            onClick={() =>
                              router.push(`/investigate/${entity.id}`)
                            }
                            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#070a0e] p-3 text-left transition hover:border-emerald-400/20"
                          >
                            <div>
                              <div className="text-sm text-white">
                                {entity.name}
                              </div>
                              <div className="mt-1 text-[10px] text-slate-600">
                                {entity.id} · {entity.type}
                              </div>
                            </div>

                            <span
                              className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${riskClass(
                                entity.risk
                              )}`}
                            >
                              {entity.risk}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CONNECTIONS */}
                  {message.connections?.length > 0 && (
                    <div className="border-t border-white/[0.06] px-5 py-4">
                      <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-600">
                        Network evidence
                      </div>

                      <div className="space-y-2">
                        {message.connections.map((connection, index) => (
                          <div
                            key={`${connection.entity?.id}-${index}`}
                            className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-[#070a0e] px-3 py-3"
                          >
                            <div>
                              <div className="text-sm text-slate-200">
                                {connection.entity?.name ||
                                  connection.entity?.id}
                              </div>

                              <div className="mt-1 text-[10px] text-slate-600">
                                {connection.entity?.type || "Entity"}
                              </div>
                            </div>

                            <span className="rounded-full border border-white/[0.06] px-2 py-1 text-[9px] uppercase tracking-wide text-slate-500">
                              {connection.relation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EVIDENCE */}
                  {message.evidence?.length > 0 && (
                    <div className="border-t border-white/[0.06] px-5 py-4">
                      <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-600">
                        Evidence used
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {message.evidence.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="flex gap-3 rounded-lg border border-white/[0.05] bg-[#070a0e] px-3 py-3 text-xs leading-5 text-slate-400"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {thinking && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#0a0d12] px-5 py-5">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:240ms]" />
                  </span>
                  Veyra is analysing the available intelligence...
                </div>
              </div>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mx-auto mt-6 w-full max-w-4xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* INPUT */}
        <div className="mx-auto mt-auto w-full max-w-4xl pt-10">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0b0f15] p-2 shadow-2xl shadow-black/20">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask Veyra about risk, entities, networks or threats..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700"
              />

              <button
                type="submit"
                disabled={!question.trim() || thinking}
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {thinking ? "Analysing..." : "Ask"}
              </button>
            </div>
          </form>

          <p className="mt-3 pb-5 text-center text-[10px] text-slate-700">
            Veyra Intelligence uses the current risk and network dataset to
            generate evidence-backed responses.
          </p>
        </div>
      </div>
    </main>
  );
}
