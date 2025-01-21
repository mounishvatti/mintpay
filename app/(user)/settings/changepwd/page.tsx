"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";

export default function ChangePasswordPage({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const router = useRouter();
    const username = useSelector((state: { user: { username: string } }) =>
        state.user.username
    );
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
    });

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.current_password && formData.new_password) {
            try {
                const data = {
                    username: username,
                    current_passowrd: formData.current_password,
                    new_password: formData.new_password,
                };
                const response = await axios.post("/api/auth/change-pwd", data);
                if (response.status === 200) {
                    toast.success("Password changed successfully");
                    router.push("/banking/user-dashboard");
                }

                if (response.status === 401) {
                    toast.error("Invalid credentials");
                }
                if (response.status === 404) {
                    toast.error("User not found");
                }
            } catch (error) {
                toast.error("Error while changing password");
                console.error("Erorr while changing password", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <div className="max-w-md flex items-center justify-center border border-gray-200 rounded-lg p-10 shadow-lg">
                    <form
                        onSubmit={login}
                        className={cn("flex flex-col gap-6", className)}
                        {...props}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-2xl font-serif font-bold">
                                Enter the following details
                            </h1>
                        </div>
                        <div className="grid gap-6 font-sans">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    Current password
                                </Label>
                                <Input
                                    id="current_password"
                                    type="text"
                                    placeholder="********"
                                    required
                                    value={formData.current_password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="new_password">
                                        New password
                                    </Label>
                                </div>
                                <Input
                                    id="new_password"
                                    type="password"
                                    placeholder=""
                                    required
                                    value={formData.new_password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Update password
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            Forgot your password?{" "}
                            <a
                                href="/signup"
                                className="underline underline-offset-4"
                            >
                                try other way
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
