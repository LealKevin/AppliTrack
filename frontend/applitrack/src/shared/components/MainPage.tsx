import { AppSidebar } from "@/shared/components/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { PanelLeftIcon } from "lucide-react";
import { Toaster } from "@/shared/components/ui/sonner";

function CustomSidebarTrigger() {
  const { toggleSidebar, state } = useSidebar();

  if (state === "collapsed") return null;

  return (
    <button
      onClick={toggleSidebar}
      className="m-2 sm:m-4 lg:m-5 fixed size-9 sm:size-10 lg:size-11 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200 z-40 touch-none"
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      <PanelLeftIcon className="size-4 sm:size-5" />
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
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
