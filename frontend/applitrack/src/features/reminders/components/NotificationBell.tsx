import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Bell, BellRing } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import NotificationPanel from "./NotificationPanel";
import useDashboardReminders from "../hooks/useDashboardReminders";

function NotificationBell() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { totalDue, urgentCount, hasOverdue } = useDashboardReminders();

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={togglePanel}
        className={`relative w-10 h-10 p-0 ${isPanelOpen ? 'bg-accent' : ''}`}
      >
        {hasOverdue ? (
          <BellRing className="h-5 w-5 text-orange-500" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        
        {/* Notification Badge */}
        {totalDue > 0 && (
          <Badge 
            variant={urgentCount > 0 ? "destructive" : "secondary"}
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium min-w-[20px]"
          >
            {totalDue > 99 ? "99+" : totalDue}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsPanelOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 z-50">
            <NotificationPanel onClose={() => setIsPanelOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;