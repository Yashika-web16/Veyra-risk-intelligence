import { NextResponse } from "next/server";

const ENTITIES = [
  {
    id: "C001",
    name: "Tanya Sethi",
    type: "Customer",
    risk: 90,
    connections: 17,
    exposure: "₹18.4L",
  },
  {
    id: "C002",
    name: "Aditya Verma",
    type: "Customer",
    risk: 82,
    connections: 11,
    exposure: "₹9.7L",
  },
  {
    id: "C003",
    name: "Rahul Mehta",
    type: "Customer",
    risk: 38,
    connections: 4,
    exposure: "₹1.2L",
  },
  {
    id: "C004",
    name: "Neha Kapoor",
    type: "Customer",
    risk: 24,
    connections: 3,
    exposure: "₹84K",
  },
  {
    id: "C005",
    name: "Arjun Shah",
    type: "Customer",
    risk: 71,
    connections: 9,
    exposure: "₹6.3L",
  },
  {
    id: "D001",
    name: "DEV-0001",
    type: "Device",
    risk: 90,
    connections: 8,
    exposure: "₹22.1L",
  },
  {
    id: "D002",
    name: "DEV-0002",
    type: "Device",
    risk: 72,
    connections: 6,
    exposure: "₹8.4L",
  },
  {
    id: "D003",
    name: "DEV-0003",
    type: "Device",
    risk: 91,
    connections: 9,
    exposure: "₹31.7L",
  },
  {
    id: "B001",
    name: "BEN-0001",
    type: "Beneficiary",
    risk: 88,
    connections: 12,
    exposure: "₹28.6L",
  },
  {
    id: "B002",
    name: "BEN-0002",
    type: "Beneficiary",
    risk: 74,
    connections: 8,
    exposure: "₹11.4L",
  },
];

const CONNECTIONS = [
  ["C001", "D001", "shared device"],
  ["C002", "D001", "shared device"],
  ["C001", "D003", "shared device"],
  ["C005", "D003", "shared device"],
  ["C001", "B001", "beneficiary"],
  ["C002", "B001", "beneficiary"],
  ["C005", "B002", "beneficiary"],
  ["C003", "D002", "device"],
  ["C004", "D002", "device"],
];

function findEntity(text) {
  const lower = text.toLowerCase();

  return (
    ENTITIES.find((entity) => lower.includes(entity.name.toLowerCase())) ||
    ENTITIES.find((entity) => lower.includes(entity.id.toLowerCase())) ||
    null
  );
}

function riskLabel(score) {
  if (score >= 85) return "CRITICAL";
  if (score >= 75) return "HIGH";
  if (score >= 50) return "ELEVATED";
  return "LOW";
}

function answerRiskQuestion(question, entity) {
  return {
    answer: `${entity.name} is currently ${riskLabel(entity.risk)} risk at ${entity.risk}/100. The main risk picture is driven by network exposure and connected-entity behaviour. Veyra currently sees ${entity.connections} network connections and approximately ${entity.exposure} in associated exposure. The next recommended step is to inspect the highest-risk connected device or beneficiary rather than treating the score alone as proof of fraud.`,
    intent: "risk_explanation",
    entity,
    evidence: [
      `${entity.risk}/100 risk score`,
      `${entity.connections} connected entities`,
      `${entity.exposure} associated exposure`,
      "Network exposure identified as a primary investigation signal",
    ],
  };
}

function answerHighestRisk() {
  const sorted = [...ENTITIES].sort((a, b) => b.risk - a.risk);
  const top = sorted.slice(0, 5);

  return {
    answer: `The highest-risk entities currently detected by Veyra are ${top
      .map((entity) => `${entity.name} (${entity.risk})`)
      .join(", ")}. The highest score is ${top[0].risk}/100 for ${
      top[0].name
    }.`,
    intent: "rank_entities",
    entities: top,
    evidence: ["Entity risk scores", "Current network exposure"],
  };
}

function answerConnections(question, entity) {
  const matches = CONNECTIONS.filter(
    ([from, to]) =>
      !entity || from === entity.id || to === entity.id
  );

  const resolved = matches.map(([from, to, relation]) => {
    const otherId = from === entity?.id ? to : from;
    const other = ENTITIES.find((item) => item.id === otherId);

    return {
      entity: other || { id: otherId },
      relation,
    };
  });

  if (!resolved.length) {
    return {
      answer:
        "I could not find a confirmed connection for that entity in the current Veyra network dataset.",
      intent: "network_lookup",
      connections: [],
    };
  }

  return {
    answer: entity
      ? `${entity.name} has ${resolved.length} detected network relationships in the current dataset: ${resolved
          .map(
            (item) =>
              `${item.entity.name} via ${item.relation}`
          )
          .join(", ")}.`
      : `Veyra found ${resolved.length} network relationships matching the current query.`,
    intent: "network_lookup",
    connections: resolved,
    evidence: resolved.map(
      (item) =>
        `${entity?.name || "Entity"} → ${item.entity.name} (${item.relation})`
    ),
  };
}

function answerCluster() {
  const cluster = [
    ENTITIES.find((item) => item.id === "C001"),
    ENTITIES.find((item) => item.id === "C002"),
    ENTITIES.find((item) => item.id === "D001"),
    ENTITIES.find((item) => item.id === "B001"),
  ].filter(Boolean);

  return {
    answer:
      "The highest-priority network cluster currently centres on DEV-0001. It links Tanya Sethi and Aditya Verma through a shared device and also connects into BEN-0001. This creates a concentrated high-risk network pattern that should be investigated as a group rather than as isolated accounts.",
    intent: "cluster_analysis",
    entities: cluster,
    evidence: [
      "DEV-0001 shared by multiple customers",
      "Tanya Sethi risk: 90/100",
      "Aditya Verma risk: 82/100",
      "BEN-0001 risk: 88/100",
    ],
  };
}

function generateIntelligence(question) {
  const lower = question.toLowerCase();
  const entity = findEntity(question);

  if (
    lower.includes("highest risk") ||
    lower.includes("most risky") ||
    lower.includes("highest-risk") ||
    lower.includes("dangerous")
  ) {
    return answerHighestRisk();
  }

  if (
    lower.includes("cluster") ||
    lower.includes("fraud ring") ||
    lower.includes("ring")
  ) {
    return answerCluster();
  }

  if (
    lower.includes("connected") ||
    lower.includes("connection") ||
    lower.includes("share") ||
    lower.includes("device")
  ) {
    return answerConnections(question, entity);
  }

  if (
    entity &&
    (lower.includes("risk") ||
      lower.includes("why") ||
      lower.includes("danger"))
  ) {
    return answerRiskQuestion(question, entity);
  }

  if (lower.includes("threat")) {
    return {
      answer:
        "Veyra currently prioritises coordinated shared-device activity, beneficiary concentration, behavioural anomalies, and rapidly expanding network exposure. The fastest investigation path is to inspect the network clusters behind the highest-risk devices.",
      intent: "threat_analysis",
      evidence: [
        "Shared-device activity",
        "Beneficiary concentration",
        "Behavioural anomalies",
        "Network expansion",
      ],
    };
  }

  return {
    answer:
      "I analysed your question against Veyra's current entity and network intelligence. Try asking about a specific entity, the highest-risk entities, suspicious connections, a network cluster, or emerging threats.",
    intent: "general_intelligence",
    evidence: [],
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const question = String(body?.question || "").trim();

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question is required.",
        },
        { status: 400 }
      );
    }

    const result = generateIntelligence(question);

    return NextResponse.json({
      success: true,
      question,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error("Veyra Intelligence error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Veyra Intelligence could not process the request.",
      },
      { status: 500 }
    );
  }
}
