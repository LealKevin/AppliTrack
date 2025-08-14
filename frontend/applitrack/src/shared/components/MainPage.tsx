import { AppSidebar } from "@/shared/components/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { PanelLeftIcon } from "lucide-react";

function CustomSidebarTrigger() {
  const { toggleSidebar, state } = useSidebar();

  if (state === "collapsed") return null;

  return (
    <button
      onClick={toggleSidebar}
      className="m-5 fixed size-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200"
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export default function MainPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <CustomSidebarTrigger />
        <div className="m-10">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
