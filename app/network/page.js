"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

const CUSTOMERS = [
  ["C001", "Tanya Sethi", 90],
  ["C002", "Aditya Verma", 82],
  ["C003", "Rahul Mehta", 38],
  ["C004", "Neha Kapoor", 24],
  ["C005", "Arjun Shah", 71],
  ["C006", "Priya Sharma", 64],
  ["C007", "Kabir Singh", 55],
  ["C008", "Ananya Rao", 43],
  ["C009", "Dev Patel", 78],
  ["C010", "Ishita Gupta", 68],
  ["C011", "Aarav Mehta", 31],
  ["C012", "Rohan Kapoor", 73],
  ["C013", "Kunal Shah", 59],
  ["C014", "Rahul Bansal", 91],
  ["C015", "Vikram Joshi", 45],
  ["C016", "Meera Iyer", 27],
];

const DEVICES = Array.from({ length: 12 }, (_, i) => [
  `DEV-${String(i + 1).padStart(4, "0")}`,
  `Device ${String(i + 1).padStart(2, "0")}`,
  90 - ((i * 7) % 45),
]);

const BENEFICIARIES = Array.from({ length: 12 }, (_, i) => [
  `BEN-${String(i + 1).padStart(4, "0")}`,
  `Beneficiary ${String(i + 1).padStart(2, "0")}`,
  84 - ((i * 5) % 40),
]);

const ALL_ENTITIES = [
  ...CUSTOMERS.map(([id, name, risk]) => ({
    id,
    label: name,
    type: "Customer",
    risk,
  })),
  ...DEVICES.map(([id, name, risk]) => ({
    id,
    label: id,
    type: "Device",
    risk,
  })),
  ...BENEFICIARIES.map(([id, name, risk]) => ({
    id,
    label: id,
    type: "Beneficiary",
    risk,
  })),
];

function riskColor(risk) {
  if (risk >= 75) return "#ef4444";
  if (risk >= 50) return "#f59e0b";
  return "#10b981";
}

function typeColor(type) {
  if (type === "Customer") return "#10b981";
  if (type === "Device") return "#94a3b8";
  return "#f59e0b";
}

export default function RiskNetworkPage() {
  const router = useRouter();

  const [selected, setSelected] = useState(ALL_ENTITIES[0]);
  const [search, setSearch] = useState("");

  const graphData = useMemo(() => {
    const nodes = ALL_ENTITIES.map((entity) => ({
      ...entity,
      name: entity.label,
    }));

    const links = [];

    // Customer -> Device
    CUSTOMERS.forEach(([customerId], customerIndex) => {
      const device1 =
        DEVICES[customerIndex % DEVICES.length][0];

      const device2 =
        DEVICES[(customerIndex + 4) % DEVICES.length][0];

      links.push({
        source: customerId,
        target: device1,
      });

      links.push({
        source: customerId,
        target: device2,
      });
    });

    // Device -> Beneficiary
    DEVICES.forEach(([deviceId], index) => {
      const beneficiary =
        BENEFICIARIES[index % BENEFICIARIES.length][0];

      links.push({
        source: deviceId,
        target: beneficiary,
      });
    });

    // A few suspicious cross-connections
    links.push(
      { source: "C001", target: "DEV-0001" },
      { source: "C001", target: "BEN-0001" },
      { source: "C002", target: "DEV-0003" },
      { source: "C005", target: "DEV-0005" },
      { source: "C009", target: "BEN-0004" },
      { source: "C014", target: "DEV-0001" },
      { source: "C014", target: "BEN-0001" }
    );

    return {
      nodes,
      links,
    };
  }, []);

  const filteredEntities = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return ALL_ENTITIES;

    return ALL_ENTITIES.filter(
      (entity) =>
        entity.id.toLowerCase().includes(value) ||
        entity.label.toLowerCase().includes(value) ||
        entity.type.toLowerCase().includes(value)
    );
  }, [search]);

  const investigate = () => {
    if (!selected?.id) return;

    router.push(`/investigate/${selected.id}`);
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-7">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />

              <span className="text-sm font-medium tracking-[0.25em] text-emerald-400">
                NETWORK INTELLIGENCE
              </span>
            </div>

            <h1 className="text-5xl font-semibold tracking-tight">
              Risk Network
            </h1>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-400">
              Explore hidden relationships between accounts, devices and
              beneficiaries to understand how risk propagates across the
              payment network.
            </p>
          </div>

          {/* SEARCH */}
          <div className="w-[320px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search network..."
              className="w-full rounded-2xl border border-slate-800 bg-[#0b0f14] px-6 py-5 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="mt-16 grid grid-cols-4 gap-7">
          <StatCard
            title="Connected accounts"
            value="28"
          />

          <StatCard
            title="Shared devices"
            value="181"
          />

          <StatCard
            title="Risk connections"
            value="2,024"
          />

          <StatCard
            title="Network risk"
            value="47/100"
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)_330px] gap-8">

          {/* GRAPH */}
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#090d12]">

            <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Relationship graph
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Click any node to investigate
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-slate-800 px-5 py-3 text-sm text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                LIVE NETWORK
              </div>
            </div>

            <div className="h-[650px] w-full">
              <ForceGraph2D
                graphData={graphData}
                backgroundColor="#090d12"
                nodeRelSize={7}
                linkColor={(link) => {
                  const source =
                    typeof link.source === "object"
                      ? link.source
                      : graphData.nodes.find(
                          (n) => n.id === link.source
                        );

                  return source?.risk >= 75
                    ? "rgba(239,68,68,0.55)"
                    : "rgba(16,185,129,0.45)";
                }}
                linkWidth={1.2}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={0.004}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.label || node.id;
                  const fontSize = Math.max(9, 12 / globalScale);

                  const radius =
                    node.id === selected?.id ? 11 : 7;

                  ctx.beginPath();
                  ctx.arc(
                    node.x,
                    node.y,
                    radius,
                    0,
                    2 * Math.PI
                  );

                  ctx.fillStyle = typeColor(node.type);
                  ctx.fill();

                  if (node.id === selected?.id) {
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                  }

                  ctx.font = `${fontSize}px Inter, sans-serif`;
                  ctx.textAlign = "center";
                  ctx.textBaseline = "top";

                  ctx.fillStyle =
                    node.risk >= 75
                      ? "#f87171"
                      : "#cbd5e1";

                  ctx.fillText(
                    label,
                    node.x,
                    node.y + radius + 3
                  );
                }}
                onNodeClick={(node) => {
                  setSelected({
                    id: node.id,
                    label: node.label,
                    type: node.type,
                    risk: node.risk,
                  });
                }}
                nodePointerAreaPaint={(node, color, ctx) => {
                  ctx.fillStyle = color;

                  ctx.beginPath();

                  ctx.arc(
                    node.x,
                    node.y,
                    14,
                    0,
                    2 * Math.PI
                  );

                  ctx.fill();
                }}
                cooldownTicks={120}
                d3VelocityDecay={0.25}
                warmupTicks={80}
              />
            </div>

            {/* LEGEND */}
            <div className="flex items-center gap-8 border-t border-slate-800 px-8 py-5 text-sm text-slate-500">
              <Legend
                type="Customer"
                color="#10b981"
              />

              <Legend
                type="Device"
                color="#94a3b8"
              />

              <Legend
                type="Beneficiary"
                color="#f59e0b"
              />

              <div className="ml-auto">
                Showing {graphData.nodes.length} entities
              </div>
            </div>
          </section>

          {/* SIDE PANEL */}
          <aside className="rounded-3xl border border-slate-800 bg-[#090d12]">

            <div className="border-b border-slate-800 px-7 py-7">
              <p className="text-xs tracking-[0.2em] text-slate-500">
                SELECTED ENTITY
              </p>

              <h2 className="mt-5 text-2xl font-semibold">
                {selected?.label}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {selected?.type}
              </p>
            </div>

            {/* RISK */}
            <div className="px-7 py-7">
              <p className="text-sm text-slate-500">
                Risk score
              </p>

              <div
                className="mt-2 text-5xl font-semibold"
                style={{
                  color: riskColor(selected?.risk || 0),
                }}
              >
                {selected?.risk}
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${selected?.risk || 0}%`,
                    backgroundColor: riskColor(
                      selected?.risk || 0
                    ),
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-600">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4 px-7">
              <InfoCard
                title="Connections"
                value="8"
              />

              <InfoCard
                title="Status"
                value={
                  selected?.risk >= 75
                    ? "High risk"
                    : selected?.risk >= 50
                    ? "Watch"
                    : "Low risk"
                }
              />
            </div>

            {/* CONNECTED ENTITIES */}
            <div className="mt-8 px-7">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.2em] text-slate-500">
                  CONNECTED ENTITIES
                </p>

                <span className="text-sm text-slate-600">
                  8
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {filteredEntities
                  .filter((entity) => entity.id !== selected?.id)
                  .slice(0, 5)
                  .map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => setSelected(entity)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-[#0d1218] px-4 py-4 text-left transition hover:border-slate-600"
                    >
                      <div>
                        <p className="font-medium">
                          {entity.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {entity.type}
                        </p>
                      </div>

                      <span
                        className="text-sm font-medium"
                        style={{
                          color: riskColor(entity.risk),
                        }}
                      >
                        {entity.risk}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* INVESTIGATE */}
            <div className="px-7 py-7">
              <button
                onClick={investigate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-4 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Investigate entity
                <span>↗</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#090d12] p-8">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-5 text-4xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1218] p-5">
      <p className="text-xs tracking-wide text-slate-600">
        {title}
      </p>

      <p className="mt-3 font-medium">
        {value}
      </p>
    </div>
  );
}

function Legend({ type, color }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />

      <span>{type}</span>
    </div>
  );
}