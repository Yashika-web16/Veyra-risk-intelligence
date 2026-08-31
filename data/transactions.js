// Veyra synthetic transaction dataset
// Generates realistic-looking payment activity for the MVP.

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomAmount() {
  const amounts = [
    850,
    1200,
    2500,
    4800,
    7500,
    12000,
    18500,
    24000,
    35000,
    52000,
    78000,
    110000,
  ];

  return randomItem(amounts);
}

function randomDate() {
  const now = Date.now();

  const hoursBack = Math.floor(Math.random() * 168);

  return new Date(
    now - hoursBack * 60 * 60 * 1000
  ).toISOString();
}

const names = [
  "Aarav Mehta",
  "Priya Sharma",
  "Rohan Kapoor",
  "Ananya Rao",
  "Kabir Singh",
  "Ishita Gupta",
  "Aditya Verma",
  "Meera Joshi",
  "Arjun Malhotra",
  "Sara Khan",
  "Neha Agarwal",
  "Kunal Shah",
  "Rahul Bansal",
  "Tanya Sethi",
  "Dev Patel",
  "Nisha Jain",
];

const locations = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

const devices = Array.from(
  { length: 180 },
  (_, index) => `DEV-${String(index + 1).padStart(4, "0")}`
);

const beneficiaries = Array.from(
  { length: 250 },
  (_, index) => `BEN-${String(index + 1).padStart(4, "0")}`
);

export const transactions = [];

for (let i = 0; i < 1000; i++) {
  const customerIndex =
    Math.floor(Math.random() * names.length);

  transactions.push({
    id: `TXN-${String(i + 1).padStart(5, "0")}`,

    customer: names[customerIndex],

    customerId: `VY-${String(
      10000 + customerIndex
    )}`,

    amount: randomAmount(),

    timestamp: randomDate(),

    deviceId: randomItem(devices),

    beneficiaryId: randomItem(beneficiaries),

    location: randomItem(locations),

    velocity: Math.floor(Math.random() * 5) + 1,

    newDevice: Math.random() < 0.08,

    newBeneficiary: Math.random() < 0.12,

    sharedDeviceAccounts:
      Math.random() < 0.08
        ? Math.floor(Math.random() * 6) + 2
        : Math.floor(Math.random() * 2),

    locationChange: Math.random() < 0.07,
  });
}

/*
 * ---------------------------------------------------------
 * Inject coordinated suspicious behaviour
 * ---------------------------------------------------------
 *
 * These transactions intentionally share:
 *
 * - the same device
 * - the same beneficiary
 * - high velocity
 * - high transaction values
 *
 * This gives Veyra a realistic coordinated-risk cluster.
 */

const suspiciousDevice = "DEV-9999";
const suspiciousBeneficiary = "BEN-9999";

for (let i = 0; i < 12; i++) {
  transactions.push({
    id: `TXN-SUS-${String(i + 1).padStart(3, "0")}`,

    customer: names[i % names.length],

    customerId: `VY-SUS-${String(i + 1).padStart(
      3,
      "0"
    )}`,

    amount: 120000 + Math.floor(Math.random() * 280000),

    timestamp: new Date(
      Date.now() - i * 4 * 60 * 1000
    ).toISOString(),

    deviceId: suspiciousDevice,

    beneficiaryId: suspiciousBeneficiary,

    location: "Mumbai",

    velocity: 10 + Math.floor(Math.random() * 8),

    newDevice: true,

    newBeneficiary: true,

    sharedDeviceAccounts: 12,

    locationChange: true,

    coordinated: true,
  });
}

export default transactions;