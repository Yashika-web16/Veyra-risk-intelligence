import { NextResponse } from "next/server";

const INTERVENTIONS = {
  block_device: {
    label: "Block suspicious device",
    riskReduction: 18,
    connectionReduction: 3,
    exposureReduction: 0.22,
  },
  freeze_beneficiary: {
    label: "Freeze beneficiary",
    riskReduction: 15,
    connectionReduction: 2,
    exposureReduction: 0.28,
  },
  reduce_velocity: {
    label: "Reduce transaction velocity",
    riskReduction: 11,
    connectionReduction: 0,
    exposureReduction: 0.12,
  },
  investigate_network: {
    label: "Investigate connected network",
    riskReduction: 7,
    connectionReduction: 1,
    exposureReduction: 0.08,
  },
};

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      entityId,
      risk = 50,
      connections = 5,
      exposure = 0,
      intervention,
    } = body;

    if (!entityId || !intervention) {
      return NextResponse.json(
        {
          success: false,
          error: "entityId and intervention are required.",
        },
        { status: 400 }
      );
    }

    const action = INTERVENTIONS[intervention];

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Unknown intervention.",
        },
        { status: 400 }
      );
    }

    const currentRisk = Math.max(0, Math.min(100, Number(risk)));
    const currentConnections = Math.max(0, Number(connections));
    const currentExposure = Math.max(0, Number(exposure));

    const projectedRisk = Math.max(
      0,
      Math.round(currentRisk - action.riskReduction)
    );

    const projectedConnections = Math.max(
      0,
      currentConnections - action.connectionReduction
    );

    const projectedExposure = Math.max(
      0,
      Math.round(currentExposure * (1 - action.exposureReduction))
    );

    const avoidedRisk = Math.max(
      0,
      currentRisk - projectedRisk
    );

    const avoidedExposure = Math.max(
      0,
      currentExposure - projectedExposure
    );

    return NextResponse.json({
      success: true,
      entityId,
      intervention: {
        key: intervention,
        label: action.label,
      },
      before: {
        risk: currentRisk,
        connections: currentConnections,
        exposure: currentExposure,
      },
      after: {
        risk: projectedRisk,
        connections: projectedConnections,
        exposure: projectedExposure,
      },
      impact: {
        avoidedRisk,
        avoidedExposure,
        connectionReduction: action.connectionReduction,
      },
      message:
        projectedRisk < 50
          ? "Intervention moves the entity below the elevated-risk threshold."
          : projectedRisk < currentRisk
            ? "Intervention materially reduces the projected risk profile."
            : "Intervention produced no meaningful risk reduction.",
      disclaimer:
        "Scenario impact is simulated using Veyra's risk model and is not a guaranteed real-world outcome.",
    });
  } catch (error) {
    console.error("Intervention API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to run intervention scenario.",
      },
      { status: 500 }
    );
  }
}
