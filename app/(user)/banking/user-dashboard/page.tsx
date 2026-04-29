"use client";

import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

type BankRow = {
  id: string;
  bankName: string;
  upiid: string;
  balance: string;
};

type AccountResponse = {
  user: {
    first_name: string;
    last_name: string;
    username: string | null;
  };
  bankdetails: BankRow[];
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function BankingUserDashboardPage() {
  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [upiDraft, setUpiDraft] = useState("");
  const [savingUPI, setSavingUPI] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<AccountResponse>("/api/banking/account");
      setData(res.data);
      const first = res.data.bankdetails[0];
      if (first) setUpiDraft(first.upiid);
    } catch {
      toast.error("Could not load account (are you logged in?)");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveUPI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiDraft.trim()) return;
    setSavingUPI(true);
    try {
      await axios.patch("/api/banking/upi-id", { upiid: upiDraft.trim() });
      toast.success("UPI ID updated");
      await load();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(String(err.response.data.message));
      } else {
        toast.error("Could not update UPI ID");
      }
    } finally {
      setSavingUPI(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center text-muted-foreground">
        Loading MintPay wallet…
      </div>
    );
  }

  if (!data?.bankdetails.length) {
    return (
      <div className="max-w-lg mx-auto p-8 space-y-4">
        <h1 className="text-2xl font-semibold">MintPay (mock UPI)</h1>
        <p className="text-muted-foreground">
          You do not have a wallet yet. Create one to get a UPI ID and mock
          balance.
        </p>
        <Button asChild>
          <Link href="/banking/create-account">Create bank account</Link>
        </Button>
      </div>
    );
  }

  const primary = data.bankdetails[0]!;
  const totalBalance = data.bankdetails.reduce(
    (sum, account) => sum + Number(account.balance),
    0,
  );

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hi, {data.user.first_name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mock UPI wallet · balances are not real money
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 auto-rows-[minmax(140px,_auto)]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm md:col-span-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total balance across {data.bankdetails.length} account
            {data.bankdetails.length > 1 ? "s" : ""}
          </p>
          <p className="text-3xl font-bold tabular-nums mt-2">
            {inr.format(totalBalance)}
          </p>
          <p className="text-xs text-muted-foreground pt-3">
            Every calendar month (UTC), MintPay credits{" "}
            <strong>{inr.format(MOCK_MONTHLY_SALARY_INR)}</strong> to{" "}
            <strong>all</strong> mock accounts once—triggered when any signed-in
            user opens this screen (or calls the account API).
          </p>
        </div>

        {data.bankdetails.map((account, index) => {
          const isPrimary = index === 0;

          return (
            <div
              key={account.id}
              className={`rounded-2xl border bg-card p-5 shadow-sm ${
                isPrimary ? "md:col-span-2 md:row-span-2" : "md:col-span-2"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {isPrimary ? "Primary account" : `Account ${index + 1}`}
              </p>
              <h3 className="text-lg font-semibold mt-1">{account.bankName.toUpperCase()}</h3>
              <p className="text-2xl font-bold tabular-nums mt-3">
                {inr.format(Number(account.balance))}
              </p>
              <p className="text-sm text-muted-foreground mt-2 break-all">
                {account.upiid}
              </p>
            </div>
          );
        })}
      </div>

      <form onSubmit={saveUPI} className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-semibold">Update primary account UPI ID</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a unique ID like <code className="text-xs">you@mintpay</code>
            . It must include <code className="text-xs">@</code>.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="upiid">UPI ID</Label>
          <Input
            id="upiid"
            value={upiDraft}
            onChange={(e) => setUpiDraft(e.target.value)}
            placeholder="yourname@mintpay"
            autoComplete="off"
          />
        </div>
        <Button type="submit" disabled={savingUPI}>
          {savingUPI ? "Saving…" : "Save UPI ID"}
        </Button>
      </form>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Send / request / expenses</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
