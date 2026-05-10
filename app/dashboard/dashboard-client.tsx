"use client";

import { useState } from "react";
import { JSX } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Wallet,
  History,
  Landmark,
  TrendingUp,
  ChevronRight,
  BadgeIndianRupee,
} from "lucide-react";
import { TopNavbar } from "@/components/top-navbar";
import SendMoney from "../(user)/banking/transactions/SendMoney";
import ReceiveMoney from "../(user)/banking/transactions/ReceiveMoney";
import ExpenseTracker from "../(user)/(dashboard-components)/ExpenseTracking";

export type DashboardUser = {
  name: string;
  email: string;
  avatar?: string;
};

type DashboardClientProps = {
  initialUser?: DashboardUser;
};

const QUICK_ACTIONS = [
  {
    label: "Send",
    key: "send-money",
    icon: ArrowUpRight,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    label: "Receive",
    key: "receive-money",
    icon: ArrowDownLeft,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    label: "Expenses",
    key: "expense-tracking",
    icon: Receipt,
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  {
    label: "Wallet",
    key: "wallet",
    icon: Wallet,
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
] as const;

const EXPLORE = [
  {
    label: "Banking",
    description: "Manage your accounts & UPI",
    icon: Landmark,
    href: "/banking/user-dashboard",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    label: "History",
    description: "View past transactions",
    icon: History,
    href: "#",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  {
    label: "Investments",
    description: "Grow your money",
    icon: TrendingUp,
    href: "#",
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
];

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const [currentView, setCurrentView] = useState<string>("dashboard");

  const views: { [key: string]: JSX.Element } = {
    "send-money": <SendMoney />,
    "receive-money": <ReceiveMoney />,
    "expense-tracking": <ExpenseTracker />,
  };

  const firstName = initialUser?.name?.split(" ")[0] ?? "there";

  /* ── Sub-page shell ── */
  if (currentView !== "dashboard") {
    return (
      <div className="min-h-screen">
        <TopNavbar
          currentView={currentView}
          onNavigate={setCurrentView}
          user={initialUser}
        />
        <main className="max-w-3xl mx-auto px-4 py-6">
          {views[currentView] ?? (
            <p className="text-center text-sm text-muted-foreground py-16">
              Coming soon
            </p>
          )}
        </main>
      </div>
    );
  }

  /* ── Home screen ── */
  return (
    <div className="min-h-screen">
      {/* Sticky top bar */}
      <TopNavbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={initialUser}
      />

      {/* Hero balance banner */}
      <div className="px-5 pt-5 pb-14">
        <p className="text-sm font-medium">
          Good day, {firstName} 👋
        </p>
        <p className="text-xs mt-4">Total Balance</p>
        <p className="text-4xl font-bold mt-1 tracking-tight tabular-nums">
          ₹ 0.00
        </p>
        <p className="text-xs mt-1">+₹0.00 (0.00%) today</p>
      </div>

      {/* Quick-actions card — floats over the banner */}
      <div className="mx-4 -mt-7">
        <div className="rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-4 divide-x">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.key}
                onClick={() => setCurrentView(action.key)}
                className="flex flex-col items-center gap-2 py-5 transition-colors"
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${action.bg}`}
                >
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="max-w-3xl mx-auto px-4 mt-6 pb-12 space-y-6">

        {/* Explore section */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3">
            Explore
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {EXPLORE.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.label}
                  </p>
                  <p className="text-xs truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* MintPay branding strip */}
        <section className="rounded-2xl bg-gradient-to-r from-[#00d09c] to-[#00b386] p-5 flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BadgeIndianRupee className="h-5 w-5 text-white" />
              <span className="text-white font-bold font-serif text-base">
                mintpay
              </span>
            </div>
            <p className="text-white/80 text-xs">
              Fast, mock UPI payments — always free
            </p>
          </div>
          <Link
            href="/banking/user-dashboard"
            className="text-xs font-semibold bg-white text-[#00d09c] rounded-full px-4 py-2 hover:bg-white/90 transition-colors"
          >
            Open Wallet
          </Link>
        </section>

        {/* Recent activity */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Recent activity
          </p>
          <div className="rounded-2xl bg-white shadow-sm p-8 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <ArrowUpRight className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Send or receive money to see activity here
            </p>
            <button
              onClick={() => setCurrentView("send-money")}
              className="mt-4 text-sm font-semibold text-[#00d09c] hover:underline"
            >
              Make your first payment →
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
