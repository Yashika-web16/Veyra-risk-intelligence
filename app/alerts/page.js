"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ALERTS = [
  {
    id: "ALT-001",
    entity: "C001",
    name: "Tanya Sethi",
    type: "Customer",
    severity: "CRITICAL",
    score: 94,
    title: "High-risk network cluster detected",
    description:
      "Entity is connected to multiple high-risk devices and beneficiaries.",
    time: "2 min ago",
    status: "OPEN",
  },
  {
    id: "ALT-002",
    entity: "C002",
    name: "Aditya Verma",
    type: "Customer",
    severity: "HIGH",
    score: 86,
    title: "Unusual transaction velocity",
    description:
      "Transaction activity has increased significantly above the historical baseline.",
    time: "14 min ago",
    status: "OPEN",
  },
  {
    id: "ALT-003",
    entity: "D003",
    name: "DEV-0003",
    type: "Device",
    severity: "HIGH",
    score: 91,
    title: "Suspicious device reuse",
    description:
      "Device is associated with multiple entities exhibiting elevated risk.",
    time: "31 min ago",
    status: "OPEN",
  },
  {
    id: "ALT-004",
    entity: "B001",
    name: "BEN-0001",
    type: "Beneficiary",
    severity: "HIGH",
    score: 88,
    title: "Beneficiary concentration anomaly",
    description:
      "Multiple customers are directing unusually high activity toward this beneficiary.",
    time: "48 min ago",
    status: "OPEN",
  },
  {
    id: "ALT-005",
    entity: "C005",
    name: "Arjun Shah",
    type: "Customer",
    severity: "ELEVATED",
    score: 71,
    title: "Behavioural pattern changed",
    description:
      "Recent activity differs materially from the entity's historical behaviour.",
    time: "1 hr ago",
    status: "OPEN",
  },
  {
    id: "ALT-006",
    entity: "C003",
    name: "Rahul Mehta",
    type: "Customer",
    severity: "ELEVATED",
    score: 63,
    title: "New network relationship",
    description:
      "A new relationship has appeared between the entity and a monitored device.",
    time: "2 hr ago",
    status: "RESOLVED",
  },
];

function getColor(severity) {
  if (severity === "CRITICAL") return "#ef4444";
  if (severity === "HIGH") return "#f59e0b";
  return "#10b981";
}

export default function AlertsPage() {
  const router = useRouter();

  const [filter, setFilter] = useState("ALL");
  const [alerts, setAlerts] = useState(ALERTS);

  const filteredAlerts = useMemo(() => {
    if (filter === "ALL") return alerts;

    return alerts.filter((alert) => alert.severity === filter);
  }, [alerts, filter]);

  const openCount = alerts.filter(
    (alert) => alert.status === "OPEN"
  ).length;

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "CRITICAL" && alert.status === "OPEN"
  ).length;

  function resolveAlert(alertId) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: "RESOLVED" }
          : alert
      )
    );
  }

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

        {/* TITLE */}

        <section className="mt-12">
          <p className="text-xs font-semibold tracking-[0.28em] text-emerald-400">
            INTELLIGENCE OPERATIONS
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Risk Alerts
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Prioritised signals requiring investigator attention.
                Every alert can be traced back to an entity and its
                surrounding risk network.
              </p>
            </div>

            <div className="rounded-3xl border border-red-900/40 bg-red-950/10 px-7 py-5">
              <p className="text-xs tracking-[0.18em] text-slate-600">
                OPEN ALERTS
              </p>

              <p className="mt-2 text-4xl font-semibold text-red-400">
                {openCount}
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            label="Critical"
            value={criticalCount}
            description="Immediate attention"
          />

          <Stat
            label="Open"
            value={openCount}
            description="Awaiting review"
          />

          <Stat
            label="Resolved"
            value={alerts.filter((a) => a.status === "RESOLVED").length}
            description="Completed investigations"
          />

          <Stat
            label="Avg. risk"
            value={`${Math.round(
              alerts.reduce((sum, a) => sum + a.score, 0) /
                alerts.length
            )}`}
            description="Across detected alerts"
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

        {/* ALERT LIST */}

        <section className="mt-5 space-y-3">

          {filteredAlerts.map((alert) => {
            const color = getColor(alert.severity);
            const resolved = alert.status === "RESOLVED";

            return (
              <article
                key={alert.id}
                className={`rounded-3xl border border-slate-800 bg-[#090d12] p-6 transition hover:border-slate-700 ${
                  resolved ? "opacity-60" : ""
                }`}
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex gap-5">

                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
                      style={{
                        color,
                        background: `${color}12`,
                      }}
                    >
                      !
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-xs text-slate-600">
                          {alert.id}
                        </span>

                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                          style={{
                            color,
                            background: `${color}12`,
                          }}
                        >
                          {alert.severity}
                        </span>

                        <span className="rounded-full border border-slate-800 px-2.5 py-1 text-[10px] text-slate-600">
                          {alert.status}
                        </span>

                      </div>

                      <h2 className="mt-3 text-lg font-semibold">
                        {alert.title}
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        {alert.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-600">

                        <span>
                          {alert.name}
                        </span>

                        <span>
                          {alert.type}
                        </span>

                        <span>
                          Detected {alert.time}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="text-right">
                      <p className="text-[10px] tracking-widest text-slate-600">
                        RISK
                      </p>

                      <p
                        className="mt-1 text-3xl font-semibold"
                        style={{ color }}
                      >
                        {alert.score}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/investigate/${alert.entity}`)
                      }
                      className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                    >
                      Investigate
                    </button>

                    {!resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                      >
                        Resolve
                      </button>
                    )}

                  </div>

                </div>

              </article>
            );
          })}

        </section>

        {/* QUICK ACTIONS */}

        <section className="mt-8 grid gap-4 md:grid-cols-2">

          <button
            onClick={() => router.push("/emerging-threats")}
            className="rounded-3xl border border-slate-800 bg-[#090d12] p-7 text-left transition hover:border-slate-700"
          >
            <p className="text-xs tracking-[0.2em] text-emerald-400">
              EARLY WARNING
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              View Emerging Threats →
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Discover risk patterns before they become major incidents.
            </p>
          </button>

          <button
            onClick={() => router.push("/network")}
            className="rounded-3xl border border-slate-800 bg-[#090d12] p-7 text-left transition hover:border-slate-700"
          >
            <p className="text-xs tracking-[0.2em] text-emerald-400">
              NETWORK INTELLIGENCE
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              Explore Risk Network →
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Trace relationships and investigate connected entities.
            </p>
          </button>

        </section>

        <div className="py-10 text-center text-xs text-slate-700">
          Veyra Intelligence Engine · Alert Operations
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
