import { NextResponse } from "next/server";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateRisk(signals) {
  const transactionVelocity = clamp(
    Number(signals.transactionVelocity || 0),
    0,
    100
  );

  const deviceSharing = clamp(
    Number(signals.deviceSharing || 0),
    0,
    100
  );

  const beneficiaryConcentration = clamp(
    Number(signals.beneficiaryConcentration || 0),
    0,
    100
  );

  const networkExposure = clamp(
    Number(signals.networkExposure || 0),
    0,
    100
  );

  const behaviouralAnomaly = clamp(
    Number(signals.behaviouralAnomaly || 0),
    0,
    100
  );

  const weightedScore =
    transactionVelocity * 0.22 +
    deviceSharing * 0.24 +
    beneficiaryConcentration * 0.18 +
    networkExposure * 0.21 +
    behaviouralAnomaly * 0.15;

  const score = Math.round(weightedScore);

  const factors = [
    {
      name: "Device sharing",
      score: Math.round(deviceSharing * 0.24),
      rawSignal: deviceSharing,
    },
    {
      name: "Network exposure",
      score: Math.round(networkExposure * 0.21),
      rawSignal: networkExposure,
    },
    {
      name: "Transaction velocity",
      score: Math.round(transactionVelocity * 0.22),
      rawSignal: transactionVelocity,
    },
    {
      name: "Beneficiary concentration",
      score: Math.round(beneficiaryConcentration * 0.18),
      rawSignal: beneficiaryConcentration,
    },
    {
      name: "Behavioural anomaly",
      score: Math.round(behaviouralAnomaly * 0.15),
      rawSignal: behaviouralAnomaly,
    },
  ]
    .filter((factor) => factor.score > 0)
    .sort((a, b) => b.score - a.score);

  let level = "LOW";

  if (score >= 80) {
    level = "CRITICAL";
  } else if (score >= 65) {
    level = "HIGH";
  } else if (score >= 40) {
    level = "ELEVATED";
  }

  let recommendation = "Continue monitoring";

  if (score >= 80) {
    recommendation = "Enhanced verification / restrict activity";
  } else if (score >= 65) {
    recommendation = "Request verification";
  } else if (score >= 40) {
    recommendation = "Increase monitoring";
  }

  return {
    score,
    level,
    recommendation,
    confidence: Math.min(
      98,
      Math.round(72 + factors.length * 5)
    ),
    factors,
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const result = calculateRisk(body.signals || body);

    return NextResponse.json({
      success: true,
      entityId: body.entityId || null,
      risk: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to calculate risk",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET() {
  const demoSignals = {
    transactionVelocity: 82,
    deviceSharing: 91,
    beneficiaryConcentration: 76,
    networkExposure: 88,
    behaviouralAnomaly: 72,
  };

  const result = calculateRisk(demoSignals);

  return NextResponse.json({
    success: true,
    entityId: "DEMO-001",
    risk: result,
  });
}