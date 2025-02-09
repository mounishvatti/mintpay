"use client"

import * as React from "react"
import {
  LifeBuoy,
  Send,
  Settings2,
  BadgeIndianRupeeIcon,
  HandCoins,
  Landmark,
  Wallet,
  ArrowRightLeft,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Payments",
      url: "#",
      icon: ArrowRightLeft,
      isActive: true,
      items: [
        {
          title: "Send Money",
          url: "#",
          key: "send-money",
        },
        {
          title: "Receive Money",
          url: "#",
          key: "receive-money",
        },
        {
          title: "Transaction History",
          url: "#",
          key: "transaction-history",
        },
      ],
    },
    {
      title: "Expense Tracking",
      url: "#",
      icon: HandCoins,
      items: [
        {
          title: "View Expenses",
          url: "#",
          key: "view-expenses",
        },
        {
          title: "Set Budget",
          url: "#",
          key: "set-budget",
        },
      ],
    },
    {
      title: "Loans",
      url: "#",
      icon: Landmark,
      items: [
        {
          title: "Apply Loan",
          url: "#",
          key: "apply-loan",
        },
        {
          title: "View Loans",
          url: "#",
          key: "view-loans",
        },
      ],
    },
    {
      title: "Wallet",
      url: "#",
      icon: Wallet,
      items: [
        {
          title: "Add money",
          url: "#",
          key: "",
        },
        {
          title: "Withdraw money",
          url: "#",
          key: "",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
          key: "general",
        },
        {
          title: "Billing",
          url: "#",
          key: "billing",
        },
        {
          title: "Limits",
          url: "#",
          key: "limits",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({onFunctionSelect,  ...props }: React.ComponentProps<typeof Sidebar> & {onFunctionSelect: (key: string) => void}) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BadgeIndianRupeeIcon className="size-5 text-sky-300" />
                </div>
                <div className="grid flex-1 text-left text-lg leading-tight">
                  <span className="truncate font-semibold font-serif">mintpay</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onFunctionSelect={onFunctionSelect} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
