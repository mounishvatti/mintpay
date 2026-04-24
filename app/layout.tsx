"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "mintpay - easy payments",
//   description: "payments made easy",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
