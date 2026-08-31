"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

const ENTITIES = [
  { id: "C001", name: "Tanya Sethi", type: "Customer", risk: 90 },
  { id: "C002", name: "Aditya Verma", type: "Customer", risk: 82 },
  { id: "C003", name: "Rahul Mehta", type: "Customer", risk: 38 },
  { id: "C004", name: "Neha Kapoor", type: "Customer", risk: 24 },
  { id: "C005", name: "Arjun Shah", type: "Customer", risk: 71 },
  { id: "C006", name: "Priya Nair", type: "Customer", risk: 65 },
  { id: "C007", name: "Vikram Rao", type: "Customer", risk: 44 },
];

const DEVICES = [
  { id: "D001", name: "DEV-0162", type: "Device", risk: 86 },
  { id: "D002", name: "DEV-0057", type: "Device", risk: 72 },
  { id: "D003", name: "DEV-0089", type: "Device", risk: 91 },
  { id: "D004", name: "DEV-0113", type: "Device", risk: 67 },
  { id: "D005", name: "DEV-0204", type: "Device", risk: 54 },
  { id: "D006", name: "DEV-0136", type: "Device", risk: 78 },
];

const BENEFICIARIES = [
  { id: "B001", name: "BEN-0042", type: "Beneficiary", risk: 88 },
  { id: "B002", name: "BEN-0192", type: "Beneficiary", risk: 74 },
  { id: "B003", name: "BEN-0071", type: "Beneficiary", risk: 69 },
  { id: "B004", name: "BEN-0138", type: "Beneficiary", risk: 81 },
];

const ALL_NODES = [...ENTITIES, ...DEVICES, ...BENEFICIARIES];

const LINKS = [
  ["C001", "D001"],
  ["C001", "D002"],
  ["C001", "B001"],
  ["C001", "B002"],
  ["C002", "D002"],
  ["C002", "D003"],
  ["C002", "B001"],
  ["C003", "D004"],
  ["C003", "B003"],
  ["C004", "D005"],
  ["C004", "B004"],
  ["C005", "D003"],
  ["C005", "D006"],
  ["C005", "B002"],
  ["C006", "D001"],
  ["C006", "B003"],
  ["C007", "D006"],
  ["C007", "B004"],
  ["D001", "D003"],
  ["D002", "D003"],
  ["D003", "B001"],
  ["D003", "B002"],
  ["D006", "B004"],
];

export default function RiskNetworkPage() {
  const [selected, setSelected] = useState(ENTITIES[0]);
  const [search, setSearch] = useState("");

  const filteredNodes = ALL_NODES.filter((node) =>
    node.name.toLowerCase().includes(search.toLowerCase())
  );

  const graphData = {
    nodes: filteredNodes,
    links: LINKS
      .map(([source, target]) => ({ source, target }))
      .filter(
        (link) =>
          filteredNodes.some((n) => n.id === link.source) &&
          filteredNodes.some((n) => n.id === link.target)
      ),
  };

  const getNodeColor = (risk) => {
    if (risk >= 80) return "#ef4444";
    if (risk >= 60) return "#f59e0b";
    return "#10b981";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090c",
        color: "#f5f7fa",
        padding: "28px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>

        <div
          style={{
            color: "#00d9a5",
            letterSpacing: "4px",
            fontSize: "14px",
            fontWeight: "700",
            marginBottom: "22px",
          }}
        >
          ● NETWORK INTELLIGENCE
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "30px",
            marginBottom: "35px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "52px",
                margin: 0,
                fontWeight: 800,
              }}
            >
              Risk Network
            </h1>

            <p
              style={{
                color: "#7183a3",
                fontSize: "18px",
                maxWidth: "900px",
                lineHeight: 1.7,
              }}
            >
              Explore hidden relationships between accounts, devices and
              beneficiaries to understand how risk propagates across the
              payment network.
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search network..."
            style={{
              width: "280px",
              padding: "18px 22px",
              background: "#0c1015",
              border: "1px solid #252b34",
              borderRadius: "16px",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          {[
            ["Connected accounts", "28"],
            ["Shared devices", "181"],
            ["Risk connections", "2,024"],
            ["Network risk", "47/100"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: "#0b0f14",
                border: "1px solid #252b34",
                borderRadius: "20px",
                padding: "30px",
              }}
            >
              <div style={{ color: "#7183a3", marginBottom: "20px" }}>
                {label}
              </div>

              <div style={{ fontSize: "34px", fontWeight: 800 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 330px",
            gap: "22px",
          }}
        >
          <section
            style={{
              background: "#0b0f14",
              border: "1px solid #252b34",
              borderRadius: "22px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "25px 30px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "22px" }}>
                  Relationship graph
                </h2>

                <p style={{ color: "#7183a3", marginBottom: 0 }}>
                  Click any node to investigate
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #26313b",
                  borderRadius: "30px",
                  padding: "10px 18px",
                  color: "#00d9a5",
                  fontSize: "13px",
                }}
              >
                ● LIVE NETWORK
              </div>
            </div>

            <div
              style={{
                height: "650px",
                background:
                  "radial-gradient(circle at center, #101722 0%, #07090c 65%)",
              }}
            >
              <ForceGraph2D
                graphData={graphData}
                backgroundColor="#07090c"
                nodeRelSize={7}
                linkColor={() => "#334155"}
                linkWidth={1.5}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                onNodeClick={(node) => setSelected(node)}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.name;
                  const fontSize = Math.max(10 / globalScale, 3);

                  ctx.beginPath();
                  ctx.arc(
                    node.x,
                    node.y,
                    node.type === "Customer" ? 10 : 7,
                    0,
                    2 * Math.PI
                  );

                  ctx.fillStyle = getNodeColor(node.risk);
                  ctx.fill();

                  ctx.strokeStyle = "#111827";
                  ctx.lineWidth = 2;
                  ctx.stroke();

                  if (globalScale > 0.8) {
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = "#dbe4f0";
                    ctx.textAlign = "center";
                    ctx.fillText(label, node.x, node.y + 20);
                  }
                }}
              />
            </div>
          </section>

          <aside
            style={{
              background: "#0b0f14",
              border: "1px solid #252b34",
              borderRadius: "22px",
              padding: "30px",
            }}
          >
            <div
              style={{
                color: "#7183a3",
                letterSpacing: "3px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              SELECTED ENTITY
            </div>

            <h2 style={{ margin: 0, fontSize: "27px" }}>
              {selected?.name}
            </h2>

            <p style={{ color: "#7183a3" }}>
              {selected?.type}
            </p>

            <div
              style={{
                marginTop: "35px",
                padding: "25px",
                background: "#10151c",
                borderRadius: "16px",
              }}
            >
              <div style={{ color: "#7183a3" }}>Risk score</div>

              <div
                style={{
                  fontSize: "54px",
                  fontWeight: 800,
                  color: getNodeColor(selected?.risk || 0),
                  marginTop: "10px",
                }}
              >
                {selected?.risk}
              </div>

              <div
                style={{
                  height: "7px",
                  background: "#202631",
                  borderRadius: "10px",
                  marginTop: "15px",
                }}
              >
                <div
                  style={{
                    width: `${selected?.risk}%`,
                    height: "100%",
                    background: getNodeColor(selected?.risk || 0),
                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "25px" }}>
              <div style={{ color: "#7183a3", marginBottom: "10px" }}>
                Investigation
              </div>

              <p style={{ lineHeight: 1.6 }}>
                This entity is connected to multiple accounts, devices and
                beneficiaries in the payment network.
              </p>
            </div>

             
  Investigate entity →
<Link
  href={`/investigate/${selected?.id}`}
  style={{
    display: "block",
    width: "100%",
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    background: "#00d9a5",
    color: "#03110d",
    fontWeight: 800,
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
  }}
>
    Investigate entity →
</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
