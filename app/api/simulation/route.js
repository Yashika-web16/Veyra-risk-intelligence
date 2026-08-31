import { NextResponse } from "next/server";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function calculateProjection(base, hours) {
  const growth = hours === 24 ? 0.035 : 0.075;

  const risk = clamp(Math.round(base.risk * (1 + growth)));

  const connections = Math.round(
    base.connections * (hours === 24 ? 1.22 : 1.55)
  );

  const exposure = Math.round(
    base.exposure * (hours === 24 ? 1.28 : 1.72)
  );

  const signals = {
    transactionVelocity: clamp(
      Math.round(base.signals.transactionVelocity + (hours === 24 ? 5 : 11))
    ),
    deviceSharing: clamp(
      Math.round(base.signals.deviceSharing + (hours === 24 ? 4 : 9))
    ),
    beneficiaryConcentration: clamp(
      Math.round(
        base.signals.beneficiaryConcentration + (hours === 24 ? 3 : 8)
      )
    ),
    networkExposure: clamp(
      Math.round(base.signals.networkExposure + (hours === 24 ? 6 : 13))
    ),
    behaviouralAnomaly: clamp(
      Math.round(base.signals.behaviouralAnomaly + (hours === 24 ? 4 : 10))
    ),
  };

  const strongestSignal = Object.entries(signals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return {
    hours,
    risk,
    connections,
    exposure,
    signals,
    strongestSignal: strongestSignal[0],
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const entityId = String(body?.entityId || "UNKNOWN");

    const base = {
      risk: Number(body?.risk ?? 67),
      connections: Number(body?.connections ?? 5),
      exposure: Number(body?.exposure ?? 420000),
      signals: {
        transactionVelocity: Number(
          body?.signals?.transactionVelocity ?? 70
        ),
        deviceSharing: Number(body?.signals?.deviceSharing ?? 70),
        beneficiaryConcentration: Number(
          body?.signals?.beneficiaryConcentration ?? 60
        ),
        networkExposure: Number(
          body?.signals?.networkExposure ?? 70
        ),
        behaviouralAnomaly: Number(
          body?.signals?.behaviouralAnomaly ?? 65
        ),
      },
    };

    const projections = [
      calculateProjection(base, 24),
      calculateProjection(base, 72),
    ];

    const riskDelta = projections[1].risk - base.risk;

    let severity = "STABLE";

    if (riskDelta >= 8) {
      severity = "ESCALATING";
    } else if (riskDelta >= 4) {
      severity = "ELEVATED";
    }

    return NextResponse.json({
      success: true,
      entityId,
      scenario: {
        type: "continued_activity",
        label: "Current behaviour continues",
      },
      baseline: {
        risk: Math.round(base.risk),
        connections: Math.round(base.connections),
        exposure: Math.round(base.exposure),
        signals: base.signals,
      },
      projections,
      summary: {
        severity,
        riskIncrease: riskDelta,
        connectionIncrease:
          projections[1].connections - Math.round(base.connections),
        exposureIncrease:
          projections[1].exposure - Math.round(base.exposure),
      },
      disclaimer:
        "Scenario projection based on current signals. This is decision-support analysis, not a guaranteed forecast.",
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Simulation engine error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate risk projection.",
      },
      { status: 500 }
    );
  }
}
