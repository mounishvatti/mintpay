"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import store from "@/store/store";

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        if (id === "confirmPin" || id === "pin") {
            if (id === "confirmPin" && value !== formData.pin) {
                setPinError("Passwords do not match");
            } else if (id === "pin" && formData.confirmPin && value !== formData.confirmPin) {
                setPinError("Passwords do not match");
            } else {
                setPinError("");
            }
        }
    };

    const createBankAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userId && username && formData.bankName && formData.pin && !pinError) {
            const upiid = `${username}${formData.bankName}@rupay`;
            const data = {
                userId: userId,
                bankName: formData.bankName,
                upiid: upiid,
                pin: formData.pin,
            };

            try {
                const response = await axios.post("/api/banking/create-account", data);
                if (response.status === 201) {
                    toast.success("Bank account created successfully");
                }
                
                router.push("/banking/user-dashboard");
                
            } catch (error) {
                toast.error("Error creating bank account, please try again");
            }
        }
    };

    return (
        <>
            <form onSubmit={createBankAccount} className="flex flex-col gap-6">
                <Label htmlFor="bankName">Select your bank</Label>
                <select
                    id="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="border border-black/30"
                    required
                >
                    <option value="sbi">State Bank of India (SBI)</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank (PNB)</option>
                    <option value="bob">Bank of Baroda (BoB)</option>
                    <option value="canara">Canara Bank</option>
                    <option value="indusind">IndusInd Bank</option>
                    <option value="yes">Yes Bank</option>
                    <option value="idbi">IDBI Bank</option>
                    <option value="uco">UCO Bank</option>
                    <option value="bom">Bank of Maharashtra</option>
                </select>

                <Label htmlFor="pin">Enter your pin</Label>
                <Input
                    id="pin"
                    type="number"
                    className="border border-black/30"
                    value={formData.pin}
                    onChange={handleInputChange}
                    required
                />

                <Label htmlFor="confirmPin">Confirm your pin</Label>
                <Input
                    id="confirmPin"
                    type="number"
                    className="border border-black/30"
                    value={formData.confirmPin}
                    onChange={handleInputChange}
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    Create Bank Account
                </button>
            </form>
        </>
    );
}