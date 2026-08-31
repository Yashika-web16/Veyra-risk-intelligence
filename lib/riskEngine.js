// Veyra Risk Engine
// ---------------------------------------------
// Rule-based risk intelligence layer.
//
// The engine evaluates:
// - transaction amount
// - velocity
// - device behaviour
// - beneficiary behaviour
// - location changes
// - account/network relationships
// ---------------------------------------------

export function calculateRisk(transaction) {
  let score = 0;

  const signals = [];

  const amount = Number(transaction.amount || 0);

  const velocity = Number(
    transaction.velocity || 0
  );

  const newDevice = Boolean(
    transaction.newDevice
  );

  const newBeneficiary = Boolean(
    transaction.newBeneficiary
  );

  const sharedDeviceAccounts = Number(
    transaction.sharedDeviceAccounts || 0
  );

  const locationChange = Boolean(
    transaction.locationChange
  );

  const coordinated = Boolean(
    transaction.coordinated
  );

  // ---------------------------------------------
  // Amount anomaly
  // ---------------------------------------------

  if (amount >= 250000) {
    score += 25;

    signals.push({
      type: "amount",
      severity: "high",
      message:
        "Transaction amount is significantly above the normal range.",
    });
  } else if (amount >= 100000) {
    score += 15;

    signals.push({
      type: "amount",
      severity: "medium",
      message:
        "Transaction amount is unusually high.",
    });
  }

  // ---------------------------------------------
  // Velocity anomaly
  // ---------------------------------------------

  if (velocity >= 12) {
    score += 25;

    signals.push({
      type: "velocity",
      severity: "critical",
      message:
        "Transaction velocity is significantly above baseline.",
    });
  } else if (velocity >= 7) {
    score += 15;

    signals.push({
      type: "velocity",
      severity: "medium",
      message:
        "Transaction velocity is elevated.",
    });
  }

  // ---------------------------------------------
  // New device
  // ---------------------------------------------

  if (newDevice) {
    score += 15;

    signals.push({
      type: "device",
      severity: "medium",
      message:
        "Transaction originated from a newly observed device.",
    });
  }

  // ---------------------------------------------
  // New beneficiary
  // ---------------------------------------------

  if (newBeneficiary) {
    score += 15;

    signals.push({
      type: "beneficiary",
      severity: "medium",
      message:
        "Payment destination has not been previously observed.",
    });
  }

  // ---------------------------------------------
  // Device network
  // ---------------------------------------------

  if (sharedDeviceAccounts >= 8) {
    score += 25;

    signals.push({
      type: "network",
      severity: "critical",
      message:
        `${sharedDeviceAccounts} accounts share the same device fingerprint.`,
    });
  } else if (sharedDeviceAccounts >= 3) {
    score += 12;

    signals.push({
      type: "network",
      severity: "medium",
      message:
        `${sharedDeviceAccounts} accounts are associated with the same device.`,
    });
  }

  // ---------------------------------------------
  // Location anomaly
  // ---------------------------------------------

  if (locationChange) {
    score += 10;

    signals.push({
      type: "location",
      severity: "low",
      message:
        "Recent activity differs from the customer's normal location pattern.",
    });
  }

  // ---------------------------------------------
  // Coordinated activity
  // ---------------------------------------------

  if (coordinated) {
    score += 30;

    signals.push({
      type: "coordination",
      severity: "critical",
      message:
        "Transaction belongs to a coordinated activity cluster.",
    });
  }

  // ---------------------------------------------
  // Final score
  // ---------------------------------------------

  score = Math.min(score, 100);

  let level = "Low";

  if (score >= 80) {
    level = "Critical";
  } else if (score >= 60) {
    level = "High";
  } else if (score >= 35) {
    level = "Medium";
  }

  return {
    score,
    level,
    flagged: score >= 60,
    signals,
    recommendation:
      getRecommendation(score),
  };
}

function getRecommendation(score) {
  if (score >= 80) {
    return "Prioritise immediate investigation and inspect connected entities.";
  }

  if (score >= 60) {
    return "Review the transaction and investigate related risk signals.";
  }

  if (score >= 35) {
    return "Continue monitoring for additional correlated behaviour.";
  }

  return "No immediate action required.";
}