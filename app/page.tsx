"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div
      className="relative grid min-h-screen lg:grid-cols-2"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/slicepay/image/upload/q_auto/v1715773670/website/sliceit-v3/images/desktop/slice_account_desktop_background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Left Corner Text */}
      <a
        href="#"
        className="absolute top-4 left-4 flex items-center gap-2 font-medium"
      >
        <span className="text-3xl font-sans text-white font-bold italic">
          rupay
        </span>
      </a>

      {/* Center Section */}
      <div className="absolute justify-center items-center flex flex-col h-full w-full">
        <div className="pb-4">
          <p className="text-center text-7xl font-serif font-bold text-white p-2">
            Feel easy with
          </p>
        </div>
        <Image
          src="https://res.cloudinary.com/slicepay/image/upload/f_auto,c_limit,w_3840,q_auto/v1715954643/website/sliceit-v3/images/desktop/slice_account_desktop_hero_money.webp"
          alt="Image"
          className="w-full max-w-xs"
          layout="responsive" // Adjusts the image's aspect ratio and makes it responsive
          width={1000}
          height={1000}
        />
        <Button className="bg-purple-600 bg-opacity-40 backdrop-blur-sm rounded-xl z-20 font-medium text-md text-purple-100 font-sans">Get Started</Button>
      </div>

      {/* Video Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/slicepay/video/upload/q_auto/v1715774323/website/sliceit-v3/videos/desktop/slice_account_banner_desktop.webm')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source
            src="https://res.cloudinary.com/slicepay/video/upload/q_auto/v1715774323/website/sliceit-v3/videos/desktop/slice_account_banner_desktop.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* UPI Phone */}
      <div
        className="absolute inset-x-0 top-[100vh] bg-purple-100"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/slicepay/image/upload/f_auto,c_limit,w_3840,q_auto/v1715954067/website/sliceit-v3/images/desktop/slice_account_desktop_UPI_phone.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "150vh",
        }}
      >
      </div>

      {/* Borrow Phone */}
      <div
        className="absolute inset-x-0 top-[250vh] bg-purple-100"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/slicepay/image/upload/f_auto,c_limit,w_3840,q_auto/v1715954064/website/sliceit-v3/images/desktop/slice_account_desktop_borrow_phone.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "150vh",
        }}
      >
      </div>

      {/* Rewards Phone */}
      <div
        className="absolute inset-x-0 top-[400vh] bg-purple-100"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/slicepay/image/upload/f_auto,c_limit,w_3840,q_auto/v1715954065/website/sliceit-v3/images/desktop/slice_account_desktop_rewards_phone.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "150vh",
        }}
      >
      </div>
    </div>
  );
}
