import { AppSidebar } from "@/shared/components/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { PanelLeftIcon } from "lucide-react";

function CustomSidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="m-5  fixed size-9 rounded-xl border-neumorphic-light flex items-center justify-center 
      text-neumorphic-400 hover:shadow-lg transition-shadow duration-300"
      style={{
        background: 'var(--card-bg, #d4d4d8)',
        boxShadow: 'var(--card-shadow, 10px 10px 30px #a1a1aa, -10px -10px 30px #ffffff)'
      }}
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export default function MainPage() {
  return (
    <SidebarProvider>
      <AppSidebar className="boxShadow-neumorphic" />
      <SidebarInset>
        <CustomSidebarTrigger />
        <div className="m-10">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
