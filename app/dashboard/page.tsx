"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import SendMoney from "../(user)/banking/transactions/SendMoney";
import ReceiveMoney from "../(user)/banking/transactions/ReceiveMoney";
import ExpenseTracker from "../(user)/(dashboard-components)/ExpenseTracking";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { JSX } from "react";
import { useState } from "react";
export default function Page() {
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const views: { [key: string]: JSX.Element } = {
    dashboard: (
      <div>
        Welcome to the dashboard, select a functionality to get started.
      </div>
    ),

    "send-money": <SendMoney />,
    "receive-money": <ReceiveMoney />,
    "expense-tracking": <ExpenseTracker />,
  };
  return (
    <SidebarProvider>
      <AppSidebar onFunctionSelect={setCurrentView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Link href="/" className="underline">
              <HomeIcon className="text-blue-500 text-xl" />
            </Link>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">
                    User Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {currentView.replace("-", " ")}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          Frequently used
          <div className="grid auto-rows-min gap-4 md:grid-cols-8">
            <div
              className="aspect-video rounded-xl bg-green-300 border border-green-600 flex items-center justify-center cursor-pointer"
              onClick={() => setCurrentView("send-money")}
            >
              <p className="text-black font-sans text-md font-normal">
                Send money
              </p>
            </div>
            <div
              className="aspect-video rounded-xl bg-yellow-300 border border-yellow-600 flex items-center justify-center cursor-pointer"
              onClick={() => setCurrentView("expense-tracking")}
            >
              <p className="text-black font-sans text-md font-normal">
                Track expenses
              </p>
            </div>

            <div
              className="aspect-video rounded-xl bg-orange-200 border border-orange-600 flex items-center justify-center cursor-pointer"
              onClick={() => setCurrentView("receive-money")}
            >
              <p className="text-black font-sans text-md font-normal">
                Request money
              </p>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-none md:min-h-min">
            {views[currentView] || (
              <p className="text-gray-600">Page not found</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
