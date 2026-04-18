"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import store from "@/app/store/store";
import { Button } from "@/components/ui/button";

export default function ReceiveMoney() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: "",
    amount: "",
  });

  const userId = store.getState().user.userId;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const recieveMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.from || !formData.amount) {
      toast.error("Fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/banking/payments/request-money", {
        from: formData.from.trim(),
        amount: Number(formData.amount),
      });
      if (response.status === 201) {
        toast.success(
          response.data.message ?? "Request recorded (mock — no transfer).",
        );
      }
      router.push("/banking/user-dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(String(err.response.data.message));
      } else {
        toast.error("Request failed, please try again");
      }
    }
  };

  return (
    <>
      {userId && (
        <div className="max-w-md mx-auto p-10 bg-white shadow-md rounded-md mt-10">
          <form onSubmit={recieveMoney} className="flex flex-col gap-6">
            <div>
              <Label
                htmlFor="from"
                className="block text-lg font-bold text-gray-700"
              >
                UPI ID to request from
              </Label>
              <Input
                type="text"
                id="from"
                placeholder="Enter UPI ID"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.from}
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
            <Button variant="default" className="text-lg font-bold" type="submit">
              Request amount
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
