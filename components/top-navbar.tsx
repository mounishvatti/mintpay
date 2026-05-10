"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  BadgeIndianRupee,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  UserCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VIEW_LABELS: Record<string, string> = {
  "send-money": "Send Money",
  "receive-money": "Receive Money",
  "expense-tracking": "Expense Tracker",
  "transaction-history": "Transaction History",
  wallet: "Wallet",
};

type TopNavbarProps = {
  currentView: string;
  onNavigate: (key: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
};

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "MU"
  );
}

export function TopNavbar({ currentView, onNavigate, user }: TopNavbarProps) {
  const { setTheme } = useTheme();
  const isSubPage = currentView !== "dashboard";

  const profile = user ?? {
    name: "MintPay User",
    email: "user@mintpay.app",
    avatar: "",
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 border-b border-white/30 dark:border-white/10 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        {/* Left — logo or back button */}
        {isSubPage ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onNavigate("dashboard")}
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <p className="font-semibold text-sm">
              {VIEW_LABELS[currentView] ?? currentView}
            </p>
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center">
              <BadgeIndianRupee className="h-5 w-5" />
            </div>
            <span className="font-bold font-serif text-lg leading-none">
              mintpay
            </span>
          </Link>
        )}

        {/* Right — actions + profile */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 p-0"
                aria-label="Account menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-xs font-bold">
                    {initials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1">
              {/* Profile header */}
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="font-bold">
                      {initials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none">
                      {profile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle2 className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="h-4 w-4" />
                  Payment methods
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-1">
                Theme
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="h-4 w-4" /> System
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4" /> Help center
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void signOut({ callbackUrl: "/" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
