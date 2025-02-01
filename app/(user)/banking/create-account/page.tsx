"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import store from "@/app/store/store";
import { Button } from "@/components/ui/button";

export default function CreateBankAccountPage() {
    const router = useRouter();
    const username = store.getState().user.username;
    const userId = store.getState().user.userId;

    const [pinError, setPinError] = useState("");

    const [formData, setFormData] = useState({
        bankName: "",
        pin: "",
        confirmPin: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        if (id === "confirmPin" || id === "pin") {
            if (id === "confirmPin" && value !== formData.pin) {
                setPinError("Passwords do not match");
            } else if (
                id === "pin" && formData.confirmPin &&
                value !== formData.confirmPin
            ) {
                setPinError("Passwords do not match");
            } else {
                setPinError("");
            }
        }
    };

    const createBankAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            userId && username && formData.bankName && formData.pin && !pinError
        ) {
            const upiid = `${username}${formData.bankName}@mintpay`;
            const data = {
                userId: userId,
                bankName: formData.bankName,
                upiid: upiid,
                pin: formData.pin,
            };

            try {
                const response = await axios.post(
                    "/api/banking/create-account",
                    data,
                );
                if (response.status === 201) {
                    toast.success("Bank account created successfully");
                }

                router.push("/banking/user-dashboard");
            } catch {
                toast.error("Error creating bank account, please try again");
            }
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto p-10 bg-white shadow-md rounded-md mt-10">
                <form
                    onSubmit={createBankAccount}
                    className="flex flex-col gap-6"
                >
                    <div>
                        <Label
                            htmlFor="bankName"
                            className="block text-lg font-bold text-gray-700"
                        >
                            Select your bank
                        </Label>
                        <select
                            id="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-md px-4 py-2"
                            required
                        >
                            <option value="sbi">
                                State Bank of India (SBI)
                            </option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                            <option value="pnb">
                                Punjab National Bank (PNB)
                            </option>
                            <option value="bob">Bank of Baroda (BoB)</option>
                            <option value="canara">Canara Bank</option>
                            <option value="indusind">IndusInd Bank</option>
                            <option value="yes">Yes Bank</option>
                            <option value="idbi">IDBI Bank</option>
                            <option value="uco">UCO Bank</option>
                            <option value="bom">Bank of Maharashtra</option>
                        </select>
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

                    <div>
                        <Label
                            htmlFor="confirmPin"
                            className="block text-lg font-bold text-gray-700"
                        >
                            Confirm your pin
                        </Label>
                        <Input
                            id="confirmPin"
                            type="number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.confirmPin}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <Button variant="default" className="text-lg font-bold">Create Bank Account</Button>
                </form>
            </div>
        </>
    );
}
