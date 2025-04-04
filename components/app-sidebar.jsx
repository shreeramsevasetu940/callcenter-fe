import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react";
import Link from "next/link";

const navMain ={
    admin:{
      title: "Admin",
      items: [
        {
          title: "Members",
          url: "/members",
        },
        {
          title: "Products",
          url: "/products",
        },
        {
          title: "Leads",
          url: "/leads",
        },
        {
          title: "Addresses",
          url: "/addresses",
        },
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "Delivery",
          url: "/delivery",
        },
        {
          title: "Balance",
          url: "/balance",
        },
      ],
    },
    manager:{
      title: "Branch Manager",
      items: [
        {
          title: "Leads",
          url: "/leads",
        },
        {
          title: "Members",
          url: "/members",
        },
        {
          title: "Balance",
          url: "/balance",
        },
      ],
    },
    employee:{
      title: "Staff",
      items: [
        {
          title: "Leads",
          url: "/leads",
        },
        {
          title: "Addresses",
          url: "/addresses",
        },
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "Balance",
          url: "/balance",
        },
      ],
    },
    couriermanager:{
      title: "Courier Manager",
      items: [
        {
          title: "Leads",
          url: "/leads",
        },
        {
          title: "Members",
          url: "/members",
        },
        {
          title: "Balance",
          url: "/balance",
        },
      ],
    },
    teamleader:{
      title: "Team Leader",
      items: [
        {
          title: "Leads",
          url: "/leads",
        },
        {
          title: "Members",
          url: "/members",
        },
        {
          title: "Balance",
          url: "/balance",
        },
      ],
    }}

export function AppSidebar({
  ...props
}) {
    const { data: session } = useSession();
    const userRole=session?.user?.role

  return (
    (<Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Shree Ram Seva Setu</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="font-semibold">{navMain?.[userRole]?.title}</div>              
                </SidebarMenuButton>
                {navMain?.[userRole]?.items?.length ? (
                  <SidebarMenuSub>
                    {navMain?.[userRole]?.items?.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>)
  );
}
