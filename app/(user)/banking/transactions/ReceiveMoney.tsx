"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import store from "@/app/store/store";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma/PrismaClient";

export default function ReceiveMoney() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: "",
    amount: "",
  });

  const userId = store.getState().user.userId;

  const fetchAndVerifyBankDetails = async (upiId: string) => {
    try {
      // Fetch the user along with their bank details
      const user = await prisma.userBankDetails.findUnique({
        where: {
          upiid: upiId,
        },
      });

      if (!user) {
        throw new Error("UPI ID not found");
      }

      // Return the verified bank details
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const recieveMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.from && formData.amount) {
      const data = {
        from: formData.from,
        amount: formData.amount,
      };

      const bankDetail = await fetchAndVerifyBankDetails(formData.from);

      if (!bankDetail) {
        toast.error("UPI ID not found");
        return;
      }

      try {
        const response = await axios.post(
          "/api/banking/payments/request-money",
          data,
        );
        if (response.status === 201) {
          toast.success("Request sent successfully");
        }

        router.push("/banking/user-dashboard");
      } catch {
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
                htmlFor="sender_upi_id"
                className="block text-lg font-bold text-gray-700"
              >
                Enter UPI ID from whom you want to request the amount
              </Label>
              <Input
                type="text"
                id="sender_upi_id"
                placeholder="Enter UPI ID"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.from}
                onChange={handleInputChange}
              ></Input>
              <Label
                htmlFor="amount"
                className="block text-lg font-bold text-gray-700"
              >
                Enter the requested amount
              </Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.amount}
                onChange={handleInputChange}
              ></Input>
            </div>
            <Button variant="default" className="text-lg font-bold">
              Request amount
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
