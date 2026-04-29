"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SendMoney() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
    pin: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const sendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.amount || !formData.pin) {
      toast.error("Fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/banking/payments/send-money", {
        from: formData.from.trim(),
        to: formData.to.trim(),
        amount: Number(formData.amount),
        pin: formData.pin,
      });
      if (response.status === 201) {
        toast.success(response.data.message ?? "Money sent successfully");
      }
      router.push("/banking/user-dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(String(err.response.data.message));
      } else {
        toast.error("Transaction failed, please try again");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white shadow-md rounded-md mt-10">
      <form onSubmit={sendMoney} className="flex flex-col gap-6">
        <div>
          <Label
            htmlFor="from"
            className="block text-lg font-bold text-gray-700"
          >
            Your UPI ID (sender)
          </Label>
          <Input
            type="text"
            id="from"
            placeholder="you@mintpay"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.from}
            onChange={handleInputChange}
            required
          />
          <Label
            htmlFor="to"
            className="block text-lg font-bold text-gray-700 mt-4"
          >
            Receiver UPI ID
          </Label>
          <Input
            type="text"
            id="to"
            placeholder="friend@mintpay"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.to}
            onChange={handleInputChange}
            required
          />
          <Label
            htmlFor="amount"
            className="block text-lg font-bold text-gray-700 mt-4"
          >
            Amount (INR)
          </Label>
          <Input
            type="number"
            id="amount"
            min={1}
            step="0.01"
            placeholder="Enter amount"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="pin" className="block text-lg font-bold text-gray-700">
            UPI PIN
          </Label>
          <Input
            id="pin"
            type="password"
            inputMode="numeric"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.pin}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button variant="default" className="text-lg font-bold" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
}
