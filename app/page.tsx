"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  BadgeIndianRupee,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  ShieldCheck,
  Zap,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant UPI",
    desc: "Send and receive money in seconds with mock UPI.",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    icon: Receipt,
    title: "Expense Tracking",
    desc: "Categorise every rupee and stay on top of your budget.",
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Insights",
    desc: "Visual spending reports to help you save more.",
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure",
    desc: "PIN-protected accounts and JWT-backed sessions.",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-10 backdrop-blur-2xl shadow-lg">
        <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <BadgeIndianRupee className="h-5 w-5" />
            </div>
            <span className="font-bold font-serif text-lg">mintpay</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
              Log in
            </Button>
            <Button size="sm" onClick={() => router.push("/signup")}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className=" px-5 py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest mb-4">
          Mock UPI · Built for developers
        </p>
        <h1 className="text-5xl md:text-6xl font-bold font-serif leading-tight">
          Feel easy with
          <br />
          <span>mintpay</span>
        </h1>
        <p className="mt-5 text-lg max-w-md mx-auto">
          A mock payments platform — send, receive and track
          money without real transactions.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            size="lg"
            className="font-semibold shadow"
            onClick={() => router.push("/signup")}
          >
            Create free account
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/login")}
          >
            Log in
          </Button>
        </div>
      </section>

      {/* ── Quick-action strip ── */}
      <div className="max-w-xl mx-auto w-full px-4 -mt-6">
        <div className="rounded-2xl shadow-md grid grid-cols-3 divide-x">
          {[
            { icon: ArrowUpRight, label: "Send", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: ArrowDownLeft, label: "Receive", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Receipt, label: "Expenses", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => router.push("/login")}
              className="flex flex-col items-center gap-2 py-5 transition-colors"
            >
              <div className={`h-11 w-11 rounded-full flex items-center justify-center ${a.bg}`}>
                <a.icon className={`h-5 w-5 ${a.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-600">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="max-w-4xl mx-auto px-5 py-16 w-full">
        <p className="text-xs font-semibold uppercase tracking-widest mb-6 text-center">
          Why mintpay
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 shadow-sm flex items-start gap-4"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="text-sm mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="max-w-4xl mx-auto px-5 pb-16 w-full">
        <div className="rounded-2xl bg-gradient-to-r p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <p className="font-bold text-xl">Ready to get started?</p>
            <p className="text-sm mt-1">Free forever · No real money involved</p>
          </div>
          <Button
            size="lg"
            className="font-semibold shadow flex-shrink-0"
            onClick={() => router.push("/signup")}
          >
            Sign up now →
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} mintpay · mock payments platform
        </p>
      </footer>

    </div>
  );
}
