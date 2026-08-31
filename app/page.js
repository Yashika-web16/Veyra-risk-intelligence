"use client";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const metrics = [
  {
    label: "Risk exposure",
    value: "₹8.2 Cr",
    change: "+12.4%",
    icon: CircleDollarSign,
  },
  {
    label: "Accounts at risk",
    value: "12,481",
    change: "+8.7%",
    icon: Users,
  },
  {
    label: "Active alerts",
    value: "342",
    change: "-6.2%",
    icon: Bell,
  },
];

const threats = [
  {
    title: "Coordinated device cluster",
    description: "17 accounts connected through a new device fingerprint.",
    severity: "Critical",
    exposure: "₹4.2L",
  },
  {
    title: "Velocity anomaly",
    description: "Unusual transaction frequency detected across 9 merchants.",
    severity: "High",
    exposure: "₹2.8L",
  },
  {
    title: "Identity mismatch",
    description:
      "Customer identity signals diverging from historical behaviour.",
    severity: "Medium",
    exposure: "₹94K",
  },
];

function RiskChart() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e13]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_50px]" />

      <div className="absolute left-5 top-5 flex items-center gap-2 text-xs text-zinc-500">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Risk activity
      </div>

      <svg
        viewBox="0 0 900 250"
        className="absolute inset-x-0 bottom-0 h-[82%] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0 205 C70 195, 85 180, 145 188 S230 210, 280 150 S360 130, 405 158 S465 185, 510 105 S585 130, 630 118 S690 80, 735 105 S805 65, 900 88 L900 250 L0 250 Z"
          fill="url(#riskFill)"
        />

        <path
          d="M0 205 C70 195, 85 180, 145 188 S230 210, 280 150 S360 130, 405 158 S465 185, 510 105 S585 130, 630 118 S690 80, 735 105 S805 65, 900 88"
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
        />
      </svg>

      <div className="absolute bottom-3 left-5 right-5 flex justify-between text-[10px] text-zinc-600">
        <span>00:00</span>
        <span>04:00</span>
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] bg-[#090b0f] px-4 py-5 lg:flex lg:flex-col">

          {/* LOGO */}
          <Link href="/" className="mb-9 flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-black shadow-[0_0_25px_rgba(52,211,153,0.18)]">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>

            <div>
              <div className="text-[15px] font-semibold tracking-tight">
                VEYRA
              </div>

              <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Risk Intelligence
              </div>
            </div>
          </Link>

          {/* WORKSPACE */}
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Workspace
          </div>

          <nav className="space-y-1">

            <NavItem
              active
              href="/"
              icon={<LayoutDashboard size={17} />}
              label="Command Center"
            />

            <NavItem
              href="/risk-monitor"
              icon={<Activity size={17} />}
              label="Risk Monitor"
            />

            <NavItem
  href="/emerging-threats"
  icon={<Sparkles size={17} />}
  label="Emerging Threats"
/>

            <NavItem
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

          {/* INTELLIGENCE */}
          <div className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Intelligence
          </div>

          <nav className="space-y-1">

            <NavItem
              href="/alerts"
              icon={<Bell size={17} />}
              label="Alerts"
              badge="342"
            />

            <NavItem
              href="/ask"
              icon={<Sparkles size={17} />}
              label="Ask Veyra"
            />

          </nav>

          {/* SYSTEM STATUS */}
          <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-medium">
                System healthy
              </span>
            </div>

            <p className="text-[11px] leading-5 text-zinc-600">
              All detection systems are operating normally.
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
                Command Center
              </span>
            </div>

            <div className="flex items-center gap-3">

              <button className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/[0.05] sm:flex">
                <Search size={14} />

                Search

                <kbd className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[9px]">
                  ⌘ K
                </kbd>
              </button>

              <Link
                href="/alerts"
                className="relative rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200"
              >
                <Bell size={18} />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
              </Link>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-medium">
                Y
              </div>

            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">

            {/* HERO */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live intelligence
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  Good morning, Risk Team.
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  Veyra has analysed your payment network and identified
                  emerging risk patterns that need attention.
                </p>

              </div>

              <Link
                href="/risk-monitor"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-emerald-300"
              >
                Investigate threats
                <ArrowUpRight size={15} />
              </Link>

            </div>

            {/* METRICS */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">

              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.label}
                    className="group rounded-2xl border border-white/[0.07] bg-[#0b0e13] p-5 transition hover:border-white/[0.12]"
                  >

                    <div className="mb-6 flex items-center justify-between">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500">
                        <Icon size={17} />
                      </div>

                      <span className="text-[11px] font-medium text-emerald-400">
                        {metric.change}
                      </span>

                    </div>

                    <p className="text-xs text-zinc-500">
                      {metric.label}
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {metric.value}
                    </p>

                  </div>
                );
              })}

            </div>

            {/* CHART */}
            <div className="mb-6 rounded-2xl border border-white/[0.07] bg-[#0b0e13] p-5">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="text-sm font-semibold">
                    Risk activity
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Detection activity across the payment network
                  </p>
                </div>

                <div className="hidden rounded-lg border border-white/[0.07] bg-white/[0.02] p-1 sm:flex">

                  {["24H", "7D", "30D"].map((range, index) => (
                    <button
                      key={range}
                      className={`rounded-md px-3 py-1.5 text-[10px] font-medium ${
                        index === 0
                          ? "bg-white/[0.08] text-zinc-200"
                          : "text-zinc-600"
                      }`}
                    >
                      {range}
                    </button>
                  ))}

                </div>

              </div>

              <RiskChart />

            </div>

            {/* BOTTOM GRID */}
            <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">

              {/* THREATS */}
              <section className="rounded-2xl border border-white/[0.07] bg-[#0b0e13] p-5">

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <h2 className="text-sm font-semibold">
                      Emerging threats
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      Patterns detected by Veyra
                    </p>
                  </div>

                  <Link
                    href="/risk-monitor"
                    className="text-[11px] text-zinc-500 hover:text-zinc-200"
                  >
                    View all
                  </Link>

                </div>

                <div className="space-y-2">

                  {threats.map((threat) => (
                    <Link
                      key={threat.title}
                      href="/risk-monitor"
                      className="flex items-center gap-4 rounded-xl border border-transparent p-3 transition hover:border-white/[0.06] hover:bg-white/[0.02]"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-400/[0.07] text-red-300">
                        <AlertTriangle size={16} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-xs font-medium">
                            {threat.title}
                          </p>

                          <span className="rounded-full bg-red-400/[0.08] px-2 py-0.5 text-[9px] font-medium text-red-300">
                            {threat.severity}
                          </span>

                        </div>

                        <p className="mt-1 truncate text-[11px] text-zinc-600">
                          {threat.description}
                        </p>

                      </div>

                      <div className="hidden text-right sm:block">

                        <p className="text-[9px] uppercase tracking-wider text-zinc-700">
                          Exposure
                        </p>

                        <p className="mt-1 text-xs font-medium text-zinc-300">
                          {threat.exposure}
                        </p>

                      </div>

                    </Link>
                  ))}

                </div>
              </section>

              {/* ASK VEYRA */}
              <section className="relative overflow-hidden rounded-2xl border border-emerald-400/10 bg-gradient-to-br from-emerald-400/[0.07] to-transparent p-5">

                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/[0.05] blur-3xl" />

                <div className="relative">

                  <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
                    <Sparkles size={18} />
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Ask Veyra
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    Investigate your network with natural language.
                  </h2>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                    Ask why risk changed, discover connected accounts, or
                    investigate an anomaly without writing a query.
                  </p>

                  <Link
                    href="/ask"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[11px] font-medium text-zinc-200 transition hover:bg-white/[0.08]"
                  >
                    Start investigation
                    <ArrowUpRight size={13} />
                  </Link>

                </div>
              </section>

            </div>

          </div>
        </section>
      </div>
    </main>
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