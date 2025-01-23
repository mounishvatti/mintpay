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
import bcrypt from "bcrypt";

export default function CreateBankAccountPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        amount: "",
        pin: "",
    });


    const userId = store.getState().user.userId;

    const fetchAndVerifyBankDetails = async (userId: string, upiId: string, pin: string) => {
        try {
            // Fetch the user along with their bank details
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    bankdetails: true,
                },
            });
    
            if (!user || user.bankdetails.length === 0) {
                throw new Error("User or bank details not found");
            }
    
            // Find the bank details matching the provided UPI ID
            const bankDetail = user.bankdetails.find((detail) => detail.upiid === upiId);
    
            if (!bankDetail) {
                throw new Error("UPI ID not found");
            }
    
            // Verify the entered PIN
            const isPinValid = await bcrypt.compare(pin, bankDetail.pin);
    
            if (!isPinValid) {
                throw new Error("Incorrect PIN");
            }
    
            // Return the verified bank details
            return bankDetail;
    
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

    const sendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            formData.from && formData.to && formData.amount
        ) {
            const data = {
                from: formData.from,
                to: formData.to,
                amount: formData.amount,
            };

            const bankDetail = await fetchAndVerifyBankDetails(
                userId,
                data.to,
                formData.pin,
            );

            if (!bankDetail) {
                toast.error("Invalid UPI ID or PIN");
                return;
            }

            try {
                const response = await axios.post(
                    "/api/banking/payments/send-money",
                    data,
                );
                if (response.status === 201) {
                    toast.success("Money sent successfully");
                }

                router.push("/banking/user-dashboard");
            } catch (error) {
                toast.error("Transaction failed, please try again");
            }
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto p-10 bg-white shadow-md rounded-md mt-10">
                <form
                    onSubmit={sendMoney}
                    className="flex flex-col gap-6"
                >
                    <div>
                    <Label
                            htmlFor="sender_upi_id"
                            className="block text-lg font-bold text-gray-700"
                        >
                            Choose which UPI ID
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
                            htmlFor="sender_upi_id"
                            className="block text-lg font-bold text-gray-700"
                        >
                            Enter the receiver UPI ID
                        </Label>
                        <Input
                            type="text"
                            id="receiver_upi_id"
                            placeholder="Enter UPI ID"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.to}
                            onChange={handleInputChange}
                        ></Input>
                        <Label
                            htmlFor="amount"
                            className="block text-lg font-bold text-gray-700"
                        >
                            Enter the amount to send
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

                    <div>
                        <Label
                            htmlFor="pin"
                            className="block text-lg font-bold text-gray-700"
                        >
                            Enter your pin
                        </Label>
                        <Input
                            id="pin"
                            type="number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.pin}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <Button variant="default" className="text-lg font-bold">Send</Button>
                </form>
            </div>
        </>
    );
}
