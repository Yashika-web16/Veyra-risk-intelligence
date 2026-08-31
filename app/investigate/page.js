"use client";

import Link from "next/link";

export default function InvestigatePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07090c",
        color: "#f5f7fa",
        padding: "35px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <Link
          href="/risk-network"
          style={{
            color: "#7183a3",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to Risk Network
        </Link>

        <div style={{ marginTop: "35px" }}>

          <div
            style={{
              color: "#00d9a5",
              letterSpacing: "4px",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            ● INVESTIGATION
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "48px",
                  margin: 0,
                }}
              >
                Tanya Sethi
              </h1>

              <p style={{ color: "#7183a3", fontSize: "17px" }}>
                Customer · C001 · Investigation ID VX-20481
              </p>
            </div>

            <div
              style={{
                padding: "14px 22px",
                borderRadius: "30px",
                background: "#351417",
                border: "1px solid #7f1d1d",
                color: "#ff5555",
                fontWeight: "700",
              }}
            >
              HIGH RISK
            </div>
          </div>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "18px",
              marginTop: "35px",
            }}
          >
            {[
              ["Risk score", "90/100"],
              ["Connected entities", "17"],
              ["Suspicious events", "12"],
              ["Network exposure", "₹18.4L"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  background: "#0b0f14",
                  border: "1px solid #252b34",
                  borderRadius: "18px",
                  padding: "25px",
                }}
              >
                <div style={{ color: "#7183a3" }}>{label}</div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: "800",
                    marginTop: "14px",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </section>

          <section
            style={{
              marginTop: "22px",
              background: "#0b0f14",
              border: "1px solid #252b34",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <div
              style={{
                color: "#7183a3",
                letterSpacing: "2px",
                fontSize: "13px",
              }}
            >
              VEYRA ANALYSIS
            </div>

            <h2 style={{ fontSize: "25px", marginBottom: "15px" }}>
              Why this entity was flagged
            </h2>

            <p
              style={{
                color: "#b7c1d1",
                fontSize: "16px",
                lineHeight: "1.8",
                maxWidth: "1000px",
              }}
            >
              Veyra detected a high-risk relationship cluster involving
              multiple customer accounts, shared devices and common
              beneficiaries. The entity is connected to several accounts that
              exhibit similar transaction behaviour within a short time
              window.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "15px",
                marginTop: "25px",
              }}
            >
              {[
                ["Shared device", "DEV-0162", "High"],
                ["Common beneficiary", "BEN-0042", "Critical"],
                ["Velocity anomaly", "12 transactions", "High"],
              ].map(([title, value, severity]) => (
                <div
                  key={title}
                  style={{
                    padding: "20px",
                    background: "#10151c",
                    borderRadius: "14px",
                  }}
                >
                  <div style={{ color: "#7183a3" }}>{title}</div>

                  <div
                    style={{
                      fontSize: "19px",
                      fontWeight: "700",
                      marginTop: "8px",
                    }}
                  >
                    {value}
                  </div>

                  <div
                    style={{
                      color: "#ef4444",
                      marginTop: "8px",
                      fontSize: "13px",
                    }}
                  >
                    ● {severity}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "22px",
              marginTop: "22px",
            }}
          >

            <section
              style={{
                background: "#0b0f14",
                border: "1px solid #252b34",
                borderRadius: "20px",
                padding: "30px",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                Risk propagation
              </h2>

              <p style={{ color: "#7183a3" }}>
                How risk travels through the network
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "30px",
                }}
              >
                {[
                  ["Tanya Sethi", "Customer"],
                  ["DEV-0162", "Device"],
                  ["Aditya Verma", "Customer"],
                  ["BEN-0042", "Beneficiary"],
                ].map(([name, type], index) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        padding: "17px",
                        borderRadius: "14px",
                        background: "#111820",
                        border: "1px solid #334155",
                      }}
                    >
                      <div style={{ fontWeight: "700" }}>{name}</div>
                      <div
                        style={{
                          color: "#7183a3",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {type}
                      </div>
                    </div>

                    {index < 3 && (
                      <span
                        style={{
                          color: "#00d9a5",
                          fontSize: "22px",
                        }}
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section
              style={{
                background: "#0b0f14",
                border: "1px solid #252b34",
                borderRadius: "20px",
                padding: "30px",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                Recommended action
              </h2>

              <div
                style={{
                  marginTop: "25px",
                  padding: "22px",
                  borderRadius: "14px",
                  background: "#151113",
                  border: "1px solid #4b2528",
                }}
              >
                <div
                  style={{
                    color: "#ef4444",
                    fontWeight: "800",
                    fontSize: "18px",
                  }}
                >
                  TEMPORARILY RESTRICT
                </div>

                <p
                  style={{
                    color: "#aeb8c8",
                    lineHeight: "1.6",
                  }}
                >
                  Restrict high-value transactions and request enhanced
                  verification before allowing further activity.
                </p>
              </div>

              <button
                style={{
                  width: "100%",
                  marginTop: "18px",
                  padding: "15px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#00d9a5",
                  color: "#03110d",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                Create investigation case
              </button>
            </section>
          </div>

          <section
            style={{
              marginTop: "22px",
              background: "#0b0f14",
              border: "1px solid #252b34",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Investigation timeline
            </h2>

            {[
              ["10:42 AM", "Velocity anomaly detected", "12 transactions within 8 minutes"],
              ["10:31 AM", "Shared device identified", "DEV-0162 linked to 4 customer accounts"],
              ["09:58 AM", "Beneficiary concentration detected", "BEN-0042 received funds from 6 accounts"],
              ["09:15 AM", "Risk score increased", "Score moved from 72 → 90"],
            ].map(([time, event, description]) => (
              <div
                key={time}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 20px 1fr",
                  gap: "15px",
                  padding: "20px 0",
                  borderBottom: "1px solid #1d2530",
                }}
              >
                <div style={{ color: "#7183a3" }}>{time}</div>

                <div style={{ color: "#00d9a5" }}>●</div>

                <div>
                  <div style={{ fontWeight: "700" }}>{event}</div>

                  <div
                    style={{
                      color: "#7183a3",
                      marginTop: "5px",
                    }}
                  >
                    {description}
                  </div>
                </div>
              </div>
            ))}
          </section>

        </div>
      </div>
    </main>
  );
}
