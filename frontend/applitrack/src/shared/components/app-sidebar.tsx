import type * as React from "react";
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconUsers,
  IconCalendar,
  IconBell,
} from "@tabler/icons-react";

import { NavMain } from "@/shared/components/nav-main";
import { NavSecondary } from "@/shared/components/nav-secondary";
import { NavUser } from "@/shared/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "@/features/authentication/contexts/AuthContext";
import { BriefcaseBusiness } from "lucide-react";
import { ModeToggle } from "@/shared/components/modeToggle";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Applications",
      url: "/applications",
      icon: IconUsers,
    },
    {
      title: "Interviews",
      url: "/interviews",
      icon: IconCalendar,
    },
    {
      title: "Reminders",
      url: "/reminders",
      icon: IconBell,
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
  const { toggleSidebar, state } = useSidebar();
  
  const handleHeaderClick = () => {
    if (state === "collapsed") {
      toggleSidebar();
    }
  };

  return (
    <Sidebar className="border-r" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <BriefcaseBusiness className="!size-5" />
            <span className="font-semibold">ApplyTrack</span>
          </div>
          
          <BriefcaseBusiness 
            className="!size-5 hidden group-data-[collapsible=icon]:block hover:scale-110 transition-transform cursor-pointer" 
            onClick={handleHeaderClick}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="py-4">
        <ModeToggle />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
