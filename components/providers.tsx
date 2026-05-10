"use client";

import { Provider as ReduxProvider } from "react-redux";
import store from "@/app/store/store";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ThemeProvider>
  );
}
