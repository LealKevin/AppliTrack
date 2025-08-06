import type * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconInnerShadowTop,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/shared/components/nav-main";
import { NavSecondary } from "@/shared/components/nav-secondary";
import { NavUser } from "@/shared/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "@/features/authentication/contexts/AuthContext";
import { BriefcaseBusiness } from "lucide-react";
// import { ModeToggle } from "@/components/modeToggle";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Stats",
      url: "/stats",
      icon: IconChartBar,
    },
    {
      title: "Applications",
      url: "/applications",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  console.log("user sidebar", user);
  return (
    <Sidebar className="bg-red rounded-xl border boxShadow-neumorphic flex " collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="py-2 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <BriefcaseBusiness className="!size-5" />
            <span className="font-semibold ">ApplyTrack</span>
          </a>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="py-4">
        {/* <ModeToggle /> */}
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
