//import { BadgeIndianRupee } from "lucide-react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "rupay - Login page",
  description: "Login to access your account",
};

export default function LoginPage() {
  return (
    <div
      className="relative grid min-h-screen lg:grid-cols-2 bg-purple-50"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/slicepay/image/upload/f_auto,c_limit,w_3840,q_auto/v1715954067/website/sliceit-v3/images/desktop/slice_account_desktop_UPI_phone.webp')",
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
        <span className="text-3xl font-sans text-purple-600 font-bold italic">
          rupay
        </span>
      </a>
      {/* Left Section */}
      <div className="hidden lg:block"></div>

      {/* Right Section */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Signup Form */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm max-h-fit bg-white rounded-xl shadow-lg p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
