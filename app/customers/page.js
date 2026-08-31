"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  CircleAlert,
  Network,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  Users,
} from "lucide-react";

const customers = [
  {
    id: "VY-10482",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    risk: 94,
    status: "Critical",
    exposure: "₹4.2L",
    transactions: 184,
    velocity: "6.8×",
    devices: 3,
    connections: 17,
    location: "Mumbai, IN",
    signals: [
      "Shared device fingerprint with 6 other accounts",
      "Transaction velocity increased 6.8× above baseline",
      "Connected to a high-risk beneficiary",
      "Behaviour correlated with 11 accounts in the network",
    ],
  },
  {
    id: "VY-10391",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    risk: 87,
    status: "High",
    exposure: "₹2.1L",
    transactions: 96,
    velocity: "4.2×",
    devices: 2,
    connections: 9,
    location: "Delhi, IN",
    signals: [
      "Unusual transaction frequency",
      "New device detected",
      "Three high-risk connections identified",
    ],
  },
  {
    id: "VY-10274",
    name: "Rohan Kapoor",
    email: "rohan.kapoor@example.com",
    risk: 76,
    status: "High",
    exposure: "₹1.4L",
    transactions: 71,
    velocity: "3.1×",
    devices: 2,
    connections: 6,
    location: "Bengaluru, IN",
    signals: [
      "Behaviour differs from historical baseline",
      "New beneficiary relationship",
      "Multiple rapid transactions",
    ],
  },
  {
    id: "VY-10138",
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    risk: 63,
    status: "Medium",
    exposure: "₹74K",
    transactions: 44,
    velocity: "2.0×",
    devices: 1,
    connections: 4,
    location: "Hyderabad, IN",
    signals: [
      "Moderate velocity anomaly",
      "Recently added beneficiary",
    ],
  },
  {
    id: "VY-10082",
    name: "Kabir Singh",
    email: "kabir.singh@example.com",
    risk: 31,
    status: "Low",
    exposure: "₹12K",
    transactions: 29,
    velocity: "1.1×",
    devices: 1,
    connections: 1,
    location: "Pune, IN",
    signals: [
      "No significant anomalies detected",
      "Behaviour consistent with historical activity",
    ],
  },
];

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] bg-[#090b0f] px-4 py-5 lg:flex lg:flex-col">

          <Link href="/" className="mb-9 flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-black">
              <ShieldCheck size={20} />
            </div>

            <div>
              <div className="text-[15px] font-semibold">
                VEYRA
              </div>

              <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Risk Intelligence
              </div>
            </div>
          </Link>

          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Workspace
          </div>

          <nav className="space-y-1">

            <NavItem
              href="/"
              icon={<Activity size={17} />}
              label="Command Center"
            />

            <NavItem
              href="/risk-monitor"
              icon={<CircleAlert size={17} />}
              label="Risk Monitor"
            />

            <NavItem
              active
              href="/customers"
              icon={<Users size={17} />}
              label="Customers"
            />

            <NavItem
              href="/network"
              icon={<Network size={17} />}
              label="Risk Network"
            />

          </nav>

          <div className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Intelligence
          </div>

          <nav className="space-y-1">

            <NavItem
              href="/alerts"
              icon={<CircleAlert size={17} />}
              label="Alerts"
              badge="342"
            />

            <NavItem
              href="/ask"
              icon={<Search size={17} />}
              label="Ask Veyra"
            />

          </nav>

          <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium">
                System healthy
              </span>
            </div>

            <p className="text-[11px] leading-5 text-zinc-600">
              Customer intelligence systems are operating normally.
            </p>

          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 flex-1">

          {/* TOPBAR */}
          <header className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5 sm:px-8">

            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span className="text-zinc-300">
                Customers
              </span>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-medium">
              Y
            </div>

          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">

            {/* HEADER */}
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  <UserRound size={13} />
                  Customer intelligence
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Customers
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Understand individual customer risk through behaviour,
                  transaction patterns and network relationships.
                </p>

              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0b0e13] px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-zinc-400">
                  12,481 customers monitored
                </span>
              </div>

            </div>

            {/* METRICS */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">

              <Stat
                label="Customers monitored"
                value="12,481"
              />

              <Stat
                label="High risk"
                value="1,284"
              />

              <Stat
                label="Critical"
                value="342"
              />

              <Stat
                label="Under investigation"
                value="87"
              />

            </div>

            {/* CONTENT */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">

              {/* CUSTOMER TABLE */}
              <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e13]">

                <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center">

                  <div>
                    <h2 className="text-sm font-semibold">
                      Risk-ranked customers
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      Customers requiring the most attention
                    </p>
                  </div>

                  <div className="relative">

                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search customer..."
                      className="w-full rounded-lg border border-white/[0.07] bg-white/[0.02] py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-zinc-700 focus:border-emerald-400/30 sm:w-56"
                    />

                  </div>

                </div>

                {/* TABLE HEADER */}
                <div className="hidden grid-cols-[1.6fr_0.7fr_0.8fr_0.8fr_0.5fr] gap-4 border-b border-white/[0.05] px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-zinc-700 md:grid">
                  <span>Customer</span>
                  <span>Risk</span>
                  <span>Exposure</span>
                  <span>Velocity</span>
                  <span />
                </div>

                <div>

                  {filteredCustomers.map((customer) => (

                    <button
                      key={customer.id}
                      onClick={() =>
                        setSelectedCustomer(customer)
                      }
                      className={`grid w-full grid-cols-1 gap-3 border-b border-white/[0.05] px-5 py-4 text-left transition md:grid-cols-[1.6fr_0.7fr_0.8fr_0.8fr_0.5fr] md:items-center md:gap-4 ${
                        selectedCustomer.id === customer.id
                          ? "bg-white/[0.035]"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >

                      {/* CUSTOMER */}
                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-zinc-500">
                          <UserRound size={15} />
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-medium text-zinc-200">
                            {customer.name}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-zinc-600">
                            {customer.id} · {customer.location}
                          </p>

                        </div>

                      </div>

                      {/* RISK */}
                      <div>

                        <div className="flex items-center gap-2">

                          <span
                            className={`h-2 w-2 rounded-full ${
                              customer.risk >= 90
                                ? "bg-red-400"
                                : customer.risk >= 70
                                ? "bg-orange-400"
                                : customer.risk >= 50
                                ? "bg-yellow-400"
                                : "bg-emerald-400"
                            }`}
                          />

                          <span className="text-xs font-semibold">
                            {customer.risk}
                          </span>

                        </div>

                        <p className="mt-1 text-[9px] text-zinc-600">
                          {customer.status}
                        </p>

                      </div>

                      {/* EXPOSURE */}
                      <div className="text-xs text-zinc-300">
                        {customer.exposure}
                      </div>

                      {/* VELOCITY */}
                      <div className="text-xs text-zinc-400">
                        {customer.velocity}
                      </div>

                      <div className="hidden justify-end md:flex">
                        <ChevronRight
                          size={15}
                          className="text-zinc-700"
                        />
                      </div>

                    </button>

                  ))}

                  {filteredCustomers.length === 0 && (
                    <div className="p-10 text-center text-xs text-zinc-600">
                      No customers found.
                    </div>
                  )}

                </div>

              </section>

              {/* CUSTOMER INTELLIGENCE */}
              <aside className="rounded-2xl border border-white/[0.07] bg-[#0b0e13]">

                <div className="border-b border-white/[0.07] p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                      <UserRound size={18} />
                    </div>

                    <div>

                      <p className="text-sm font-semibold">
                        {selectedCustomer.name}
                      </p>

                      <p className="mt-1 text-[10px] text-zinc-600">
                        {selectedCustomer.id}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5">

                  {/* SCORE */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-zinc-500">
                        Veyra risk score
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                          selectedCustomer.risk >= 90
                            ? "bg-red-400/[0.1] text-red-300"
                            : selectedCustomer.risk >= 70
                            ? "bg-orange-400/[0.1] text-orange-300"
                            : "bg-emerald-400/[0.1] text-emerald-300"
                        }`}
                      >
                        {selectedCustomer.status}
                      </span>

                    </div>

                    <div className="mt-4 flex items-end gap-2">

                      <span className="text-4xl font-semibold">
                        {selectedCustomer.risk}
                      </span>

                      <span className="mb-1 text-xs text-zinc-600">
                        / 100
                      </span>

                    </div>

                    <div className="mt-4 h-1.5 rounded-full bg-white/[0.07]">

                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{
                          width: `${selectedCustomer.risk}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* BEHAVIOUR */}
                  <div className="mt-6">

                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      Behaviour signals
                    </div>

                    <div className="grid grid-cols-2 gap-2">

                      <MiniMetric
                        icon={<Activity size={14} />}
                        label="Transactions"
                        value={selectedCustomer.transactions}
                      />

                      <MiniMetric
                        icon={<Activity size={14} />}
                        label="Velocity"
                        value={selectedCustomer.velocity}
                      />

                      <MiniMetric
                        icon={<Smartphone size={14} />}
                        label="Devices"
                        value={selectedCustomer.devices}
                      />

                      <MiniMetric
                        icon={<Network size={14} />}
                        label="Connections"
                        value={selectedCustomer.connections}
                      />

                    </div>

                  </div>

                  {/* SIGNALS */}
                  <div className="mt-6">

                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      Why Veyra flagged this customer
                    </div>

                    <div className="space-y-2">

                      {selectedCustomer.signals.map((signal) => (

                        <div
                          key={signal}
                          className="flex gap-3 rounded-lg border border-white/[0.05] bg-white/[0.015] p-3"
                        >

                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                          <span className="text-[11px] leading-5 text-zinc-400">
                            {signal}
                          </span>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 grid grid-cols-2 gap-2">

                    <Link
                      href="/network"
                      className="flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-3 text-[10px] font-semibold text-black hover:bg-emerald-300"
                    >
                      View network
                      <ArrowUpRight size={13} />
                    </Link>

                    <Link
                      href="/risk-monitor"
                      className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-[10px] font-medium text-zinc-300 hover:bg-white/[0.05]"
                    >
                      Investigate
                    </Link>

                  </div>

                </div>

              </aside>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0e13] p-5">
      <p className="text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

      <div className="flex items-center gap-2 text-zinc-600">
        {icon}
        <span className="text-[9px]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-zinc-200">
        {value}
      </p>

    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  badge,
  href = "#",
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
        active
          ? "bg-white/[0.07] text-zinc-100"
          : "text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300"
      }`}
    >
      {icon}

      <span className="flex-1">
        {label}
      </span>

      {badge && (
        <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-zinc-500">
          {badge}
        </span>
      )}
    </Link>
  );
}