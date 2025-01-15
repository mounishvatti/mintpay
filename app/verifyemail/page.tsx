"use client";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { BadgeIndianRupee } from "lucide-react";

import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function ConfirmEmailPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-violet-900">
            <div className="rounded-lg p-8 m-4 w-full max-w-md shadow-md gap-4 bg-white">
                {/* Logo Section */}
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <BadgeIndianRupee className="size-5" />
                        </div> */}
                        <span className="text-2xl font-sans text-violet-600 font-bold italic">
                            rupay
                        </span>
                    </a>
                </div>

                {/* OTP Section */}
                <div className="mt-6">
                    <p className="text-center text-md font-normal font-sans text-slate-900 p-2">
                        Enter the code sent to your email
                    </p>

                    <div className="flex items-center justify-center p-2 pt-4">
                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </div>
            </div>
        </div>
    );
}
