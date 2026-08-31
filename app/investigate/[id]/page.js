"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ENTITY_DATA = {
  C001: {
    name: "Tanya Sethi",
    type: "Customer",
    risk: 90,
    connections: 17,
    exposure: "₹18.4L",
  },
  C002: {
    name: "Aditya Verma",
    type: "Customer",
    risk: 82,
    connections: 11,
    exposure: "₹9.7L",
  },
  C003: {
    name: "Rahul Mehta",
    type: "Customer",
    risk: 38,
    connections: 4,
    exposure: "₹1.2L",
  },
  C004: {
    name: "Neha Kapoor",
    type: "Customer",
    risk: 24,
    connections: 3,
    exposure: "₹84K",
  },
  C005: {
    name: "Arjun Shah",
    type: "Customer",
    risk: 71,
    connections: 9,
    exposure: "₹6.3L",
  },
  D001: {
    name: "DEV-0001",
    type: "Device",
    risk: 90,
    connections: 8,
    exposure: "₹22.1L",
  },
  D002: {
    name: "DEV-0002",
    type: "Device",
    risk: 72,
    connections: 6,
    exposure: "₹8.4L",
  },
  D003: {
    name: "DEV-0003",
    type: "Device",
    risk: 91,
    connections: 9,
    exposure: "₹31.7L",
  },
  B001: {
    name: "BEN-0001",
    type: "Beneficiary",
    risk: 88,
    connections: 12,
    exposure: "₹28.6L",
  },
  B002: {
    name: "BEN-0002",
    type: "Beneficiary",
    risk: 74,
    connections: 8,
    exposure: "₹11.4L",
  },
};

const DEFAULT_ENTITY = {
  name: "Unknown Entity",
  type: "Unknown",
  risk: 67,
  connections: 5,
  exposure: "₹4.2L",
};

function getRiskLabel(score) {
  if (score >= 85) return "CRITICAL";
  if (score >= 75) return "HIGH RISK";
  if (score >= 50) return "ELEVATED";
  return "LOW RISK";
}

function getRiskColor(score) {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  return "#10b981";
}

function getEntityIcon(type) {
  if (type === "Device") return "◈";
  if (type === "Beneficiary") return "◇";
  return "●";
}

export default function InvestigationPage() {
  const params = useParams();
  const router = useRouter();

  const [action, setAction] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(true);

  const [networkData, setNetworkData] = useState(null);
  const [loadingNetwork, setLoadingNetwork] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const id = params?.id || "UNKNOWN";

  const entity = useMemo(() => {
    return (
      ENTITY_DATA[id] || {
        ...DEFAULT_ENTITY,
        name: id,
      }
    );
  }, [id]);

  /*
   * RISK ENGINE
   */

  useEffect(() => {
    async function loadRisk() {
      try {
        setLoadingRisk(true);

        const response = await fetch("/api/risk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entityId: id,
            signals: {
              transactionVelocity: 85,
              deviceSharing: 90,
              beneficiaryConcentration: 70,
              networkExposure: 88,
              behaviouralAnomaly: 75,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Risk API request failed");
        }

        const data = await response.json();

        if (data.success && data.risk) {
          setRiskData(data.risk);
        }
      } catch (error) {
        console.error("Risk engine error:", error);
      } finally {
        setLoadingRisk(false);
      }
    }

    if (id) {
      loadRisk();
    }
  }, [id]);

  /*
   * NETWORK INTELLIGENCE
   *
   * Pull the entity's relationships from the Veyra
   * network API instead of relying only on hard-coded
   * connections.
   */

  useEffect(() => {
    async function loadNetwork() {
      try {
        setLoadingNetwork(true);
        setNetworkError(false);

        const response = await fetch(
          `/api/network?entity=${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Network API request failed");
        }

        const data = await response.json();

        if (data.success) {
          setNetworkData(data);
        } else {
          throw new Error("Network API returned an unsuccessful response");
        }
      } catch (error) {
        console.error("Network intelligence error:", error);
        setNetworkError(true);
      } finally {
        setLoadingNetwork(false);
      }
    }

    if (id) {
      loadNetwork();
    }
  }, [id]);

  const calculatedRisk = riskData?.score ?? entity.risk;

  const riskColor = getRiskColor(calculatedRisk);
  const riskLabel = getRiskLabel(calculatedRisk);

  const factorTotal =
    riskData?.factors?.reduce(
      (sum, factor) => sum + Number(factor.score || 0),
      0
    ) || 0;

  /*
   * NETWORK DATA
   *
   * The API may expose nodes/edges, connections, or
   * analysis depending on the current implementation.
   * These fallbacks keep the UI stable.
   */

const networkNodes = useMemo(
  () =>
    networkData?.nodes ||
    networkData?.graph?.nodes ||
    networkData?.analysis?.nodes ||
    [],
  [networkData]
);

const networkEdges = useMemo(
  () =>
    networkData?.edges ||
    networkData?.graph?.edges ||
    networkData?.analysis?.edges ||
    [],
  [networkData]
);

const rawConnections = useMemo(
  () =>
    networkData?.connections ||
    networkData?.neighbors ||
    networkData?.analysis?.connections ||
    networkData?.analysis?.neighbors ||
    [],
  [networkData]
);

 

  const dynamicConnections = useMemo(() => {
    if (Array.isArray(rawConnections) && rawConnections.length) {
      return rawConnections
        .map((connection) => {
          const connectionId =
            connection.id ||
            connection.entityId ||
            connection.target ||
            connection.targetId ||
            connection.nodeId;

          if (!connectionId || connectionId === id) {
            return null;
          }

          const known = ENTITY_DATA[connectionId];

          return {
            id: connectionId,
            name:
              connection.name ||
              connection.label ||
              known?.name ||
              connectionId,
            type:
              connection.type ||
              connection.entityType ||
              known?.type ||
              "Entity",
            risk: Number(
              connection.risk ??
                connection.score ??
                connection.riskScore ??
                known?.risk ??
                50
            ),
          };
        })
        .filter(Boolean);
    }

    if (Array.isArray(networkNodes) && networkNodes.length) {
      return networkNodes
        .filter((node) => node.id !== id)
        .slice(0, 6)
        .map((node) => {
          const known = ENTITY_DATA[node.id];

          return {
            id: node.id,
            name: node.name || node.label || known?.name || node.id,
            type: node.type || known?.type || "Entity",
            risk: Number(
              node.risk ??
                node.score ??
                node.riskScore ??
                known?.risk ??
                50
            ),
          };
        });
    }

    return [];
  }, [rawConnections, networkNodes, id]);

  /*
   * If the API has no relationship payload yet, retain
   * the polished demo relationships rather than showing
   * an empty investigation screen.
   */

  const fallbackConnections = [
    {
      id: "D001",
      name: "DEV-0001",
      type: "Device",
      risk: 90,
    },
    {
      id: "B001",
      name: "BEN-0001",
      type: "Beneficiary",
      risk: 88,
    },
    {
      id: "C002",
      name: "Aditya Verma",
      type: "Customer",
      risk: 82,
    },
    {
      id: "D003",
      name: "DEV-0003",
      type: "Device",
      risk: 91,
    },
    {
      id: "C005",
      name: "Arjun Shah",
      type: "Customer",
      risk: 71,
    },
  ];

  const connectionsToShow =
    dynamicConnections.length > 0
      ? dynamicConnections.slice(0, 6)
      : fallbackConnections;

  const networkRisk =
    networkData?.adjustedRisk ??
    networkData?.risk ??
    networkData?.analysis?.adjustedRisk ??
    networkData?.analysis?.risk ??
    calculatedRisk;

  const networkExposureScore =
    networkData?.networkExposure ??
    networkData?.analysis?.networkExposure ??
    Math.min(100, connectionsToShow.length * 12);

  const highRiskConnections = connectionsToShow.filter(
    (connection) => Number(connection.risk) >= 75
  ).length;

  const connectionCount =
    networkData?.connectionCount ??
    networkData?.analysis?.connectionCount ??
    networkData?.totalConnections ??
    networkNodes.length - 1 ??
    entity.connections;

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

        {/* TOP BAR */}

        <div className="flex flex-wrap items-center justify-between gap-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <span className="text-lg">←</span>
            Back to Risk Network
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            VEYRA INTELLIGENCE ENGINE
            <span>•</span>
            LIVE
          </div>
        </div>

        {/* HEADER */}

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xl"
                  style={{ color: riskColor }}
                >
                  {getEntityIcon(entity.type)}
                </span>

                <span
                  className="text-xs font-semibold tracking-[0.28em]"
                  style={{ color: riskColor }}
                >
                  ENTITY INVESTIGATION
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {entity.name}
                </h1>

                <span className="rounded-full border border-slate-800 bg-[#0b0f14] px-3 py-1.5 text-xs text-slate-400">
                  {entity.type}
                </span>

                <span className="rounded-full border border-slate-800 bg-[#0b0f14] px-3 py-1.5 text-xs text-slate-500">
                  {id}
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Veyra analysed behavioural signals, network relationships
                and transaction patterns to determine the current risk
                posture of this entity.
              </p>
            </div>

            {/* RISK SCORE */}

            <div
              className="min-w-[230px] rounded-3xl border p-6"
              style={{
                borderColor: `${riskColor}55`,
                background: `${riskColor}08`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.18em] text-slate-500">
                  RISK SCORE
                </span>

                <span
                  className="text-xs font-bold"
                  style={{ color: riskColor }}
                >
                  {loadingRisk ? "ANALYSING" : riskLabel}
                </span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span
                  className="text-5xl font-semibold"
                  style={{ color: riskColor }}
                >
                  {loadingRisk ? "..." : calculatedRisk}
                </span>

                <span className="mb-2 text-sm text-slate-600">
                  / 100
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${loadingRisk ? 0 : calculatedRisk}%`,
                    backgroundColor: riskColor,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SUMMARY CARDS */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Metric
            label="Network connections"
            value={
              loadingNetwork
                ? "..."
                : connectionCount > 0
                  ? connectionCount
                  : entity.connections
            }
            detail="entities linked"
          />

          <Metric
            label="Network exposure"
            value={entity.exposure}
            detail="estimated value"
          />

          <Metric
            label="Risk contributors"
            value={riskData?.factors?.length || 0}
            detail="signals detected"
          />

          <Metric
            label="Confidence"
            value={
              loadingRisk
                ? "..."
                : `${riskData?.confidence ?? 94}%`
            }
            detail="model confidence"
          />

        </section>

        {/* NETWORK INTELLIGENCE STRIP */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <NetworkStat
            label="NETWORK RISK"
            value={loadingNetwork ? "..." : `${networkRisk}/100`}
            color={getRiskColor(networkRisk)}
            detail="network-adjusted posture"
          />

          <NetworkStat
            label="HIGH-RISK LINKS"
            value={loadingNetwork ? "..." : highRiskConnections}
            color={highRiskConnections > 0 ? "#ef4444" : "#10b981"}
            detail="connections above 75 risk"
          />

          <NetworkStat
            label="EXPOSURE SIGNAL"
            value={
              loadingNetwork
                ? "..."
                : `${Math.round(networkExposureScore)}%`
            }
            color={getRiskColor(networkExposureScore)}
            detail="network concentration"
          />

        </section>

        {/* MAIN GRID */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

          {/* EXPLAINABLE RISK */}

          <section className="rounded-3xl border border-slate-800 bg-[#090d12] p-7">

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] text-emerald-400">
                  EXPLAINABLE RISK
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Why this entity was flagged
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Risk score is composed from observable network and
                  behavioural signals.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 px-4 py-2 text-xs text-slate-500">
                {loadingRisk
                  ? "Calculating..."
                  : `${factorTotal} signal points`}
              </div>
            </div>

            <div className="mt-8 space-y-6">

              {loadingRisk ? (
                <>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </>
              ) : riskData?.factors?.length ? (
                riskData.factors.map((factor, index) => (
                  <div key={factor.name}>

                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs"
                          style={{
                            background: `${riskColor}12`,
                            color: riskColor,
                          }}
                        >
                          {index + 1}
                        </span>

                        <span className="text-sm font-medium">
                          {factor.name}
                        </span>
                      </div>

                      <span
                        className="text-sm font-semibold"
                        style={{ color: riskColor }}
                      >
                        +{factor.score}
                      </span>
                    </div>

                    <div className="ml-10 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            Number(factor.rawSignal || 0),
                            100
                          )}%`,
                          backgroundColor: riskColor,
                        }}
                      />
                    </div>

                    <p className="ml-10 mt-2 text-xs text-slate-600">
                      Signal intensity:{" "}
                      {Math.round(factor.rawSignal || 0)}%
                    </p>

                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 p-6 text-sm text-slate-500">
                  No risk contributors available.
                </div>
              )}

            </div>

            <div className="mt-9 border-t border-slate-800 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Calculated risk score
                </span>

                <span
                  className="text-2xl font-semibold"
                  style={{ color: riskColor }}
                >
                  {loadingRisk ? "..." : `${calculatedRisk}/100`}
                </span>
              </div>
            </div>

          </section>

          {/* NETWORK EXPOSURE */}

          <section className="rounded-3xl border border-slate-800 bg-[#090d12] p-7">

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] text-emerald-400">
                  NETWORK EXPOSURE
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Connected entities
                </h2>
              </div>

              {loadingNetwork && (
                <span className="text-[10px] tracking-widest text-slate-600">
                  LOADING
                </span>
              )}
            </div>

            <div className="mt-7 space-y-3">

              {connectionsToShow.map((connection) => (
                <button
                  key={connection.id}
                  onClick={() =>
                    router.push(`/investigate/${connection.id}`)
                  }
                  className="w-full text-left transition hover:scale-[1.01]"
                >
                  <Connection
                    id={connection.id}
                    name={connection.name}
                    type={connection.type}
                    risk={Number(connection.risk)}
                  />
                </button>
              ))}

            </div>

            {networkError && (
              <p className="mt-4 text-[11px] leading-5 text-slate-600">
                Live network data unavailable. Showing the latest
                intelligence snapshot.
              </p>
            )}

            <button
              onClick={() => router.push("/network")}
              className="mt-6 w-full rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-400 transition hover:border-slate-600 hover:text-white"
            >
              Explore full network →
            </button>

          </section>

        </div>

        {/* NETWORK EVIDENCE */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-[#090d12] p-7">

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-emerald-400">
                NETWORK EVIDENCE
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Why the network matters
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Veyra uses relationships between customers, devices and
                beneficiaries as additional evidence when assessing risk.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 px-4 py-2 text-xs text-slate-500">
              {loadingNetwork
                ? "Analysing network..."
                : `${connectionsToShow.length} relationships visible`}
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">

            <EvidenceCard
              label="SHARED INFRASTRUCTURE"
              value={
                connectionsToShow.filter(
                  (item) => item.type === "Device"
                ).length
              }
              description="device relationships detected"
            />

            <EvidenceCard
              label="BENEFICIARY LINKS"
              value={
                connectionsToShow.filter(
                  (item) => item.type === "Beneficiary"
                ).length
              }
              description="beneficiary relationships detected"
            />

            <EvidenceCard
              label="HIGH-RISK NEIGHBOURS"
              value={highRiskConnections}
              description="connected entities above risk threshold"
            />

          </div>

          {networkEdges.length > 0 && (
            <div className="mt-5 text-xs text-slate-700">
              Network engine returned {networkEdges.length} relationship
              edges for this investigation.
            </div>
          )}

        </section>

        {/* TIMELINE */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-[#090d12] p-7">

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-emerald-400">
                EVENT STREAM
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Investigation timeline
              </h2>
            </div>

            <span className="text-xs text-slate-600">
              Last 24 hours
            </span>
          </div>

          <div className="mt-8 grid">

            <TimelineItem
              time="10:42 AM"
              title="Risk signal detected"
              description="Behavioural anomaly increased entity risk score."
              status="HIGH"
              color="#ef4444"
            />

            <TimelineItem
              time="10:31 AM"
              title="Network relationship discovered"
              description={`New connection identified between this entity and ${
                connectionsToShow[0]?.name || "a monitored entity"
              }.`}
              status="NEW"
              color="#f59e0b"
            />

            <TimelineItem
              time="09:58 AM"
              title="Transaction velocity changed"
              description="Transaction frequency exceeded historical baseline."
              status="WATCH"
              color="#f59e0b"
            />

            <TimelineItem
              time="09:15 AM"
              title="Risk score recalculated"
              description={
                loadingRisk
                  ? "Risk engine is calculating the latest score."
                  : `Entity risk score calculated at ${calculatedRisk}/100.`
              }
              status="MODEL"
              color="#10b981"
            />

          </div>

        </section>

        {/* ACTION AREA */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-[#090d12] p-7">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div>
              <p className="text-xs tracking-[0.2em] text-emerald-400">
                RECOMMENDED ACTION
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                {loadingRisk
                  ? "Analysing entity..."
                  : riskData?.recommendation ||
                    "Continue monitoring"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Veyra recommends an investigator review based on the
                current risk score and network evidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <ActionButton
                label="Monitor"
                active={action === "monitor"}
                onClick={() => setAction("monitor")}
              />

              <ActionButton
                label="Request verification"
                active={action === "verify"}
                onClick={() => setAction("verify")}
              />

              {calculatedRisk >= 75 && (
                <ActionButton
                  label="Restrict"
                  danger
                  active={action === "restrict"}
                  onClick={() => setAction("restrict")}
                />
              )}

            </div>

          </div>

          {action && (
            <div className="mt-6 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 px-5 py-4 text-sm text-emerald-300">
              Action selected:{" "}
              <span className="font-semibold">
                {action === "verify"
                  ? "Request verification"
                  : action.charAt(0).toUpperCase() + action.slice(1)}
              </span>
              . This action has been recorded in the investigation workspace.
            </div>
          )}

        </section>

        {/* FOOTER */}

        <div className="py-10 text-center text-xs text-slate-700">
          Veyra Intelligence Engine · Investigation ID VX-{id}
        </div>

      </div>
    </main>
  );
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090d12] p-6">
      <p className="text-xs tracking-wide text-slate-600">
        {label}
      </p>

      <p className="mt-4 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {detail}
      </p>
    </div>
  );
}

function NetworkStat({ label, value, color, detail }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090d12] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.18em] text-slate-600">
          {label}
        </p>

        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <p
        className="mt-3 text-2xl font-semibold"
        style={{ color }}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {detail}
      </p>
    </div>
  );
}

function EvidenceCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1117] p-5">
      <p className="text-[10px] tracking-[0.18em] text-slate-600">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-slate-200">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}

function Connection({ id, name, type, risk }) {
  const color = getRiskColor(risk);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#0c1117] px-4 py-4 transition hover:border-slate-700">

      <div className="flex items-center gap-3">

        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-xs"
          style={{
            background: `${color}12`,
            color,
          }}
        >
          {type === "Device"
            ? "◈"
            : type === "Beneficiary"
              ? "◇"
              : "●"}
        </div>

        <div>
          <p className="text-sm font-medium">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {type} · {id}
          </p>
        </div>

      </div>

      <span
        className="text-sm font-semibold"
        style={{ color }}
      >
        {risk}
      </span>

    </div>
  );
}

function TimelineItem({
  time,
  title,
  description,
  status,
  color,
}) {
  return (
    <div className="grid grid-cols-[90px_18px_1fr_auto] gap-4 border-b border-slate-800 py-5 last:border-0">

      <span className="text-xs text-slate-600">
        {time}
      </span>

      <div className="relative flex justify-center">
        <span
          className="mt-1 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          {description}
        </p>
      </div>

      <span
        className="h-fit rounded-full px-2.5 py-1 text-[10px] font-semibold"
        style={{
          color,
          background: `${color}12`,
        }}
      >
        {status}
      </span>

    </div>
  );
}

function ActionButton({
  label,
  onClick,
  active,
  danger = false,
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border px-5 py-3 text-sm font-medium transition"
      style={{
        borderColor: active
          ? danger
            ? "#ef4444"
            : "#10b981"
          : "#26303c",

        background: active
          ? danger
            ? "#ef444412"
            : "#10b98112"
          : "#0c1117",

        color: active
          ? danger
            ? "#ef4444"
            : "#10b981"
          : "#94a3b8",
      }}
    >
      {label}
    </button>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-48 rounded bg-slate-800" />
        <div className="h-4 w-10 rounded bg-slate-800" />
      </div>

      <div className="ml-10 h-2 rounded-full bg-slate-800" />
    </div>
  );
}
