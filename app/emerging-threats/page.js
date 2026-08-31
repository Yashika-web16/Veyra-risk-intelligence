"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const THREATS = [
  {
    id: "THR-001",
    title: "Shared Device Cluster",
    severity: "CRITICAL",
    score: 94,
    status: "ACTIVE",
    detected: "8 min ago",
    description:
      "Multiple high-risk customers are connected through the same device infrastructure.",
    entities: ["C001", "C002", "D001", "B001"],
    signal: "Device reuse",
    growth: "+38%",
  },
  {
    id: "THR-002",
    title: "Rapid Beneficiary Concentration",
    severity: "HIGH",
    score: 86,
    status: "ACTIVE",
    detected: "21 min ago",
    description:
      "Several accounts are directing unusually high transaction volume toward a small beneficiary cluster.",
    entities: ["C001", "C002", "C005", "B001"],
    signal: "Transaction concentration",
    growth: "+27%",
  },
  {
    id: "THR-003",
    title: "Cross-Account Behaviour Shift",
    severity: "HIGH",
    score: 81,
    status: "ACTIVE",
    detected: "42 min ago",
    description:
      "A group of entities has recently shifted transaction behaviour away from historical patterns.",
    entities: ["C002", "C005", "D003"],
    signal: "Behaviour anomaly",
    growth: "+19%",
  },
  {
    id: "THR-004",
    title: "Dormant Account Reactivation",
    severity: "ELEVATED",
    score: 67,
    status: "WATCH",
    detected: "1 hr ago",
    description:
      "Previously inactive entities have become active within an overlapping transaction window.",
    entities: ["C003", "C004", "D002"],
    signal: "Activity spike",
    growth: "+12%",
  },
];

function severityColor(severity) {
  if (severity === "CRITICAL") return "#ef4444";
  if (severity === "HIGH") return "#f59e0b";
  return "#10b981";
}

export default function EmergingThreatsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");

  const filteredThreats = useMemo(() => {
    if (filter === "ALL") return THREATS;

    return THREATS.filter((threat) => threat.severity === filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-5">
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
            LIVE
          </div>
        </div>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-emerald-400">
                EARLY WARNING SYSTEM
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Emerging Threats
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Detect newly forming risk patterns before they become
                widespread incidents. Veyra continuously analyses
                behavioural, transactional and network signals.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-900/40 bg-emerald-950/10 px-6 py-5">
              <p className="text-xs tracking-widest text-slate-600">
                ACTIVE THREATS
              </p>

              <div className="mt-2 text-4xl font-semibold text-emerald-400">
                {THREATS.filter((t) => t.status === "ACTIVE").length}
              </div>
            </div>

          </div>
        </section>

        {/* STATS */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            label="Critical"
            value={THREATS.filter((t) => t.severity === "CRITICAL").length}
            description="Immediate attention"
          />

          <Stat
            label="High Risk"
            value={THREATS.filter((t) => t.severity === "HIGH").length}
            description="Requires investigation"
          />

          <Stat
            label="Entities affected"
            value="12"
            description="Across active clusters"
          />

          <Stat
            label="Fastest growth"
            value="+38%"
            description="Last detection window"
          />

        </section>

        {/* FILTER */}

        <div className="mt-10 flex flex-wrap gap-2">

          {["ALL", "CRITICAL", "HIGH", "ELEVATED"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className="rounded-xl border px-4 py-2 text-xs font-semibold transition"
              style={{
                borderColor:
                  filter === item ? "#10b981" : "#1e293b",
                background:
                  filter === item ? "#10b98112" : "#090d12",
                color:
                  filter === item ? "#10b981" : "#64748b",
              }}
            >
              {item}
            </button>
          ))}

        </div>

        {/* THREATS */}

        <section className="mt-5 space-y-4">

          {filteredThreats.map((threat) => {
            const color = severityColor(threat.severity);

            return (
              <article
                key={threat.id}
                className="rounded-3xl border border-slate-800 bg-[#090d12] p-6 transition hover:border-slate-700"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex gap-5">

                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg"
                      style={{
                        background: `${color}12`,
                        color,
                      }}
                    >
                      !
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-semibold">
                          {threat.title}
                        </h2>

                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                          style={{
                            background: `${color}12`,
                            color,
                          }}
                        >
                          {threat.severity}
                        </span>

                        <span className="rounded-full border border-slate-800 px-2.5 py-1 text-[10px] text-slate-600">
                          {threat.status}
                        </span>

                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                        {threat.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-600">
                        <span>
                          Detected {threat.detected}
                        </span>

                        <span>
                          Signal:{" "}
                          <span className="text-slate-400">
                            {threat.signal}
                          </span>
                        </span>

                        <span>
                          Growth:{" "}
                          <span style={{ color }}>
                            {threat.growth}
                          </span>
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="flex shrink-0 items-center gap-5">

                    <div className="text-right">
                      <p className="text-xs text-slate-600">
                        THREAT SCORE
                      </p>

                      <p
                        className="mt-1 text-3xl font-semibold"
                        style={{ color }}
                      >
                        {threat.score}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/investigate/${threat.entities[0]}`
                        )
                      }
                      className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                    >
                      Investigate →
                    </button>

                  </div>

                </div>

                {/* ENTITY CHIPS */}

                <div className="mt-6 border-t border-slate-800 pt-5">

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-xs text-slate-600">
                      Affected entities
                    </span>

                    {threat.entities.map((entity) => (
                      <button
                        key={entity}
                        onClick={() =>
                          router.push(`/investigate/${entity}`)
                        }
                        className="rounded-lg border border-slate-800 bg-[#0c1117] px-3 py-1.5 text-xs text-slate-400 transition hover:border-emerald-900 hover:text-emerald-400"
                      >
                        {entity}
                      </button>
                    ))}
                  </div>

                </div>

              </article>
            );
          })}

        </section>

        {/* INTELLIGENCE FOOTER */}

        <section className="mt-8 rounded-3xl border border-emerald-900/30 bg-emerald-950/10 p-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-xs tracking-[0.2em] text-emerald-400">
                VEYRA EARLY WARNING
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Threat patterns are continuously ranked by severity.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Prioritise investigations based on network impact,
                behavioural anomalies and accelerating risk signals.
              </p>
            </div>

            <button
              onClick={() => router.push("/network")}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
            >
              Open Risk Network →
            </button>

          </div>

        </section>

        <div className="py-10 text-center text-xs text-slate-700">
          Veyra Intelligence Engine · Emerging Threat Detection
        </div>

      </div>
    </main>
  );
}

function Stat({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090d12] p-6">
      <p className="text-xs tracking-wide text-slate-600">
        {label}
      </p>

      <p className="mt-4 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}
