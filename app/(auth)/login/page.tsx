//import { BadgeIndianRupee } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "mintpay - Login page",
  description: "Login to access your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <header className="border-b shadow-sm">
        <div className="max-w-5xl mx-auto flex h-14 items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm">₹</span>
            </div>
            <span className="font-bold font-serif text-lg">mintpay</span>
          </Link>
        </div>
      </header>

      {/* Centred card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl shadow-md p-8">
          <LoginForm />
        </div>
      </div>

    </div>
  );
}
