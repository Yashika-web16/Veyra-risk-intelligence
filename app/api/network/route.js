import { NextResponse } from "next/server";

const nodes = [
  {
    id: "C001",
    label: "Tanya Sethi",
    type: "Customer",
    risk: 90,
  },
  {
    id: "C002",
    label: "Aditya Verma",
    type: "Customer",
    risk: 82,
  },
  {
    id: "C003",
    label: "Rahul Mehta",
    type: "Customer",
    risk: 38,
  },
  {
    id: "C004",
    label: "Neha Kapoor",
    type: "Customer",
    risk: 24,
  },
  {
    id: "C005",
    label: "Arjun Shah",
    type: "Customer",
    risk: 71,
  },
  {
    id: "D001",
    label: "DEV-0001",
    type: "Device",
    risk: 90,
  },
  {
    id: "D002",
    label: "DEV-0002",
    type: "Device",
    risk: 72,
  },
  {
    id: "D003",
    label: "DEV-0003",
    type: "Device",
    risk: 91,
  },
  {
    id: "B001",
    label: "BEN-0001",
    type: "Beneficiary",
    risk: 88,
  },
  {
    id: "B002",
    label: "BEN-0002",
    type: "Beneficiary",
    risk: 74,
  },
];

const links = [
  {
    source: "C001",
    target: "D001",
    relationship: "USES_DEVICE",
  },
  {
    source: "C002",
    target: "D001",
    relationship: "USES_DEVICE",
  },
  {
    source: "C003",
    target: "D002",
    relationship: "USES_DEVICE",
  },
  {
    source: "C004",
    target: "D002",
    relationship: "USES_DEVICE",
  },
  {
    source: "C005",
    target: "D003",
    relationship: "USES_DEVICE",
  },
  {
    source: "C001",
    target: "B001",
    relationship: "SENDS_TO",
  },
  {
    source: "C002",
    target: "B001",
    relationship: "SENDS_TO",
  },
  {
    source: "C005",
    target: "B002",
    relationship: "SENDS_TO",
  },
  {
    source: "C001",
    target: "C002",
    relationship: "SHARED_NETWORK",
  },
  {
    source: "C002",
    target: "C005",
    relationship: "SHARED_NETWORK",
  },
  {
    source: "D001",
    target: "D003",
    relationship: "DEVICE_CLUSTER",
  },
];

function getRiskLevel(score) {
  if (score >= 85) return "CRITICAL";
  if (score >= 75) return "HIGH";
  if (score >= 50) return "ELEVATED";
  return "LOW";
}

function getNeighbors(entityId) {
  const connectedIds = new Set();

  links.forEach((link) => {
    if (link.source === entityId) {
      connectedIds.add(link.target);
    }

    if (link.target === entityId) {
      connectedIds.add(link.source);
    }
  });

  return nodes.filter((node) => connectedIds.has(node.id));
}

function calculateNetworkRisk(entityId) {
  const entity = nodes.find((node) => node.id === entityId);

  if (!entity) {
    return null;
  }

  const neighbors = getNeighbors(entityId);

  const highRiskNeighbors = neighbors.filter(
    (node) => node.risk >= 75
  );

  const criticalNeighbors = neighbors.filter(
    (node) => node.risk >= 85
  );

  const averageNeighborRisk =
    neighbors.length > 0
      ? Math.round(
          neighbors.reduce(
            (sum, node) => sum + node.risk,
            0
          ) / neighbors.length
        )
      : 0;

  const networkExposure = Math.min(
    100,
    Math.round(
      entity.risk * 0.55 +
        averageNeighborRisk * 0.3 +
        highRiskNeighbors.length * 8
    )
  );

  const networkBoost = Math.min(
    25,
    highRiskNeighbors.length * 6 +
      criticalNeighbors.length * 3
  );

  const adjustedRisk = Math.min(
    100,
    entity.risk + networkBoost
  );

  return {
    entity,
    neighbors,
    highRiskNeighbors,
    criticalNeighbors,
    averageNeighborRisk,
    networkExposure,
    networkBoost,
    adjustedRisk,
    adjustedLevel: getRiskLevel(adjustedRisk),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const entityId = searchParams.get("entity");

  if (entityId) {
    const analysis = calculateNetworkRisk(entityId);

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "Entity not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  }

  return NextResponse.json({
    success: true,
    nodes,
    links,
    meta: {
      nodeCount: nodes.length,
      linkCount: links.length,
      highRiskEntities: nodes.filter(
        (node) => node.risk >= 75
      ).length,
    },
  });
}