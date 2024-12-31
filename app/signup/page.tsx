import { BadgeIndianRupee } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
    return (
        <div
            className="relative grid min-h-screen lg:grid-cols-2"
            style={{
                backgroundImage:
                    "url('https://res.cloudinary.com/slicepay/image/upload/v1718021209/website/sliceit-v3/images/desktop/og_Image.png')",
                backgroundSize: "cover",
                backgroundPosition: "left",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Positioned at top left corner */}
            <a
                href="/"
                className="absolute top-4 left-4 flex items-center gap-2 font-medium"
            >
                <span className="text-3xl font-sans text-white font-bold italic">
                    rupay
                </span>
            </a>
            {/* Left Section */}
            <div className="hidden lg:block"></div>

            {/* Right Section */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                {/* Signup Form */}
                <div className="flex flex-1 items-center justify-center bg-white bg-opacity-50 backdrop-blur-3xl rounded-3xl p-6 shadow-lg">
                    <div className="w-full max-w-xs">
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
