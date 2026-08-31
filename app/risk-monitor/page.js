"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const fallbackEvents = [
  {
    id: 1,
    time: "10:42:18",
    title: "Coordinated account cluster",
    type: "Network anomaly",
    severity: "CRITICAL",
    score: 91,
    exposure: "₹4.2L",
    accounts: 17,
    devices: 6,
    description:
      "Multiple accounts exhibited highly correlated transaction behaviour within a short time window.",
    reasons: [
      "6 accounts share the same device fingerprint",
      "17 accounts appeared within 18 minutes",
      "Similar transaction amounts and timing",
      "Common beneficiary detected",
    ],
  },
  {
    id: 2,
    time: "10:31:44",
    title: "Unusual transaction velocity",
    type: "Behaviour anomaly",
    severity: "HIGH",
    score: 82,
    exposure: "₹1.8L",
    accounts: 8,
    devices: 3,
    description:
      "Transaction frequency increased significantly above the historical baseline.",
    reasons: [
      "Transaction velocity 4.7× normal",
      "New beneficiaries detected",
      "Behaviour differs from account history",
    ],
  },
  {
    id: 3,
    time: "10:17:09",
    title: "New device concentration",
    type: "Device anomaly",
    severity: "MEDIUM",
    score: 67,
    exposure: "₹74K",
    accounts: 5,
    devices: 2,
    description:
      "Several accounts interacted with the payment network from newly observed devices.",
    reasons: [
      "2 previously unseen devices",
      "5 accounts affected",
      "Transactions occurred within a 12-minute window",
    ],
  },
];

export default function RiskMonitor() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [range, setRange] = useState("24H");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRiskData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/risk");

        if (!response.ok) {
          throw new Error("Risk API unavailable");
        }

        const data = await response.json();

        const mappedEvents = data.results.map((item, index) => {
          const risk = item.risk;

          const exposure = formatCurrency(item.amount);

          return {
            id: item.id || index + 1,
            time: new Date().toLocaleTimeString("en-IN", {
              hour12: false,
            }),
            title: getThreatTitle(risk.signals),
            type: getThreatType(risk.signals),
            severity: risk.level.toUpperCase(),
            score: risk.score,
            exposure,
            accounts: Math.max(
              item.sharedDeviceAccounts || 1,
              1
            ),
            devices: item.newDevice ? 1 : 0,
            description:
              risk.signals[0]?.message ||
              "Risk behaviour detected by the Veyra engine.",
            reasons: risk.signals.map(
              (signal) => signal.message
            ),
            customer: item.customer,
            customerId: item.customerId,
          };
        });

        setEvents(mappedEvents);

        if (mappedEvents.length > 0) {
          setSelectedEvent(mappedEvents[0]);
        }
      } catch (err) {
        console.error(err);

        setError(
          "Live risk engine unavailable. Showing cached investigation data."
        );

        setEvents(fallbackEvents);
        setSelectedEvent(fallbackEvents[0]);
      } finally {
        setLoading(false);
      }
    }

    loadRiskData();
  }, []);

  const metrics = useMemo(() => {
    const threats = events.length;

    const critical = events.filter(
      (event) => event.severity === "CRITICAL"
    ).length;

    const accounts = events.reduce(
      (total, event) => total + event.accounts,
      0
    );

    const exposure = events.reduce(
      (total, event) =>
        total + parseCurrency(event.exposure),
      0
    );

    return {
      threats,
      critical,
      accounts,
      exposure,
    };
  }, [events]);

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
                Live detection
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight">
              Risk Monitor
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Veyra continuously analyses transaction behaviour,
              account relationships and network signals to surface
              emerging threats.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0c0f13] px-4 py-3">

            <div className="text-xs text-slate-500">
              Network status
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              {loading ? "Analysing" : "Monitoring"}
            </div>

          </div>
        </div>

        {/* ERROR / FALLBACK */}
        {error && (
          <div className="mt-6 rounded-xl border border-yellow-400/10 bg-yellow-400/[0.03] px-4 py-3 text-xs text-yellow-300">
            {error}
          </div>
        )}

        {/* METRICS */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <Metric
            label="Threats detected"
            value={loading ? "—" : metrics.threats}
            change="LIVE"
          />

          <Metric
            label="Critical threats"
            value={loading ? "—" : metrics.critical}
            change="LIVE"
          />

          <Metric
            label="Accounts affected"
            value={loading ? "—" : metrics.accounts}
            change="LIVE"
          />

          <Metric
            label="Potential exposure"
            value={
              loading
                ? "—"
                : formatLargeCurrency(metrics.exposure)
            }
            change="LIVE"
          />

        </div>

        {/* MAIN GRID */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

          {/* LEFT */}
          <section className="rounded-2xl border border-white/10 bg-[#0b0e12]">

            <div className="flex flex-col justify-between gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center">

              <div>
                <h2 className="font-medium">
                  Risk activity
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Anomaly detection across the payment network
                </p>
              </div>

              <div className="flex rounded-lg border border-white/10 p-1">
                {["24H", "7D", "30D"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`rounded-md px-4 py-2 text-xs transition ${
                      range === item
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

            </div>

            {/* GRAPH */}
            <div className="relative h-[280px] overflow-hidden px-6 py-8">

              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
                  backgroundSize: "80px 60px",
                }}
              />

              <svg
                viewBox="0 0 900 240"
                className="relative h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="riskFill"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00d9a0"
                      stopOpacity=".25"
                    />

                    <stop
                      offset="100%"
                      stopColor="#00d9a0"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 190
                  C70 185 80 170 140 175
                  S210 120 270 145
                  S350 165 410 125
                  S490 140 530 95
                  S600 120 650 80
                  S720 100 760 50
                  S820 70 900 25
                  L900 240
                  L0 240 Z"
                  fill="url(#riskFill)"
                />

                <path
                  d="M0 190
                  C70 185 80 170 140 175
                  S210 120 270 145
                  S350 165 410 125
                  S490 140 530 95
                  S600 120 650 80
                  S720 100 760 50
                  S820 70 900 25"
                  fill="none"
                  stroke="#00d9a0"
                  strokeWidth="3"
                />
              </svg>

              <div className="absolute bottom-3 left-6 right-6 flex justify-between text-[10px] text-slate-600">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>NOW</span>
              </div>

            </div>
          </section>

          {/* RIGHT */}
          <section className="rounded-2xl border border-white/10 bg-[#0b0e12]">

            <div className="border-b border-white/10 px-6 py-5">

              <h2 className="font-medium">
                Threat queue
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Highest priority events
              </p>

            </div>

            <div>

              {loading && (
                <div className="p-8 text-center text-xs text-slate-600">
                  Analysing transactions...
                </div>
              )}

              {!loading &&
                events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full border-b border-white/5 px-6 py-5 text-left transition ${
                      selectedEvent?.id === event.id
                        ? "bg-white/[0.04]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <div className="flex items-center gap-2">

                          <span
                            className={`h-2 w-2 rounded-full ${
                              event.severity === "CRITICAL"
                                ? "bg-red-400"
                                : event.severity === "HIGH"
                                ? "bg-orange-400"
                                : event.severity === "MEDIUM"
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
                            }`}
                          />

                          <span className="text-[10px] uppercase tracking-wider text-slate-500">
                            {event.severity}
                          </span>

                        </div>

                        <h3 className="mt-2 text-sm font-medium">
                          {event.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {event.time} · {event.type}
                        </p>

                      </div>

                      <span className="text-xs font-medium text-emerald-400">
                        {event.score}
                      </span>

                    </div>
                  </button>
                ))}

            </div>
          </section>
        </div>

        {/* INVESTIGATION PANEL */}
        {selectedEvent && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#0b0e12]">

            <div className="flex flex-col justify-between gap-5 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-lg font-medium">
                    {selectedEvent.title}
                  </h2>

                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-medium tracking-wider text-red-400">
                    {selectedEvent.severity}
                  </span>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {selectedEvent.description}
                </p>

                {selectedEvent.customer && (
                  <p className="mt-2 text-xs text-emerald-400">
                    Customer: {selectedEvent.customer}
                  </p>
                )}

              </div>

              <Link
                href="/network"
                className="rounded-lg bg-emerald-400 px-5 py-3 text-center text-xs font-semibold text-black transition hover:bg-emerald-300"
              >
                Explore network ↗
              </Link>

            </div>

            <div className="grid gap-6 p-7 sm:grid-cols-2 xl:grid-cols-4">

              <InvestigationMetric
                label="Risk score"
                value={`${selectedEvent.score}/100`}
              />

              <InvestigationMetric
                label="Potential exposure"
                value={selectedEvent.exposure}
              />

              <InvestigationMetric
                label="Accounts connected"
                value={selectedEvent.accounts}
              />

              <InvestigationMetric
                label="Devices involved"
                value={selectedEvent.devices}
              />

            </div>

            <div className="border-t border-white/10 p-7">

              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                Why Veyra flagged this
              </h3>

              <div className="mt-5 grid gap-3 md:grid-cols-2">

                {selectedEvent.reasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4 text-sm text-slate-300"
                  >
                    <span className="mr-3 text-emerald-400">
                      ✓
                    </span>

                    {reason}
                  </div>
                ))}

              </div>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

function getThreatTitle(signals = []) {
  const types = signals.map((signal) => signal.type);

  if (types.includes("network")) {
    return "Coordinated account cluster";
  }

  if (types.includes("velocity")) {
    return "Unusual transaction velocity";
  }

  if (types.includes("device")) {
    return "New device concentration";
  }

  if (types.includes("beneficiary")) {
    return "Unusual beneficiary activity";
  }

  return "Emerging risk event";
}

function getThreatType(signals = []) {
  const types = signals.map((signal) => signal.type);

  if (types.includes("network")) {
    return "Network anomaly";
  }

  if (types.includes("velocity")) {
    return "Behaviour anomaly";
  }

  if (types.includes("device")) {
    return "Device anomaly";
  }

  if (types.includes("beneficiary")) {
    return "Beneficiary anomaly";
  }

  return "Risk anomaly";
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function parseCurrency(value) {
  if (typeof value === "number") return value;

  return Number(
    String(value)
      .replace(/[₹,\s]/g, "")
      .replace(/L/gi, "00000")
      .replace(/Cr/gi, "0000000")
  ) || 0;
}

function formatLargeCurrency(value) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function Metric({ label, value, change }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0e12] p-6">

      <div className="text-xs text-slate-500">
        {label}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">

        <span className="text-2xl font-semibold">
          {value}
        </span>

        <span className="text-xs text-emerald-400">
          {change}
        </span>

      </div>
    </div>
  );
}

function InvestigationMetric({ label, value }) {
  return (
    <div>

      <div className="text-xs text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-xl font-semibold">
        {value}
      </div>

    </div>
  );
}