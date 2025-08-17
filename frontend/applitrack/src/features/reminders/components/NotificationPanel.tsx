import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CheckCircle2, ExternalLink, Calendar, Clock } from "lucide-react";
// import ReminderCard from "./ReminderCard"; // TODO: Use for full reminder cards if needed
import useDashboardReminders from "../hooks/useDashboardReminders";
import { REMINDER_URGENCIES } from "../types/dashboard";

interface NotificationPanelProps {
  onClose: () => void;
}

function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { data, isLoading, totalDue } = useDashboardReminders();

  if (isLoading) {
    return (
      <div className="w-96 bg-popover rounded-lg border shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || totalDue === 0) {
    return (
      <div className="w-80 bg-popover rounded-lg border shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        
        <div className="text-center py-6">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            All caught up! No pending reminders.
          </p>
          <Button variant="outline" size="sm" asChild onClick={onClose}>
            <Link to="/applications">Set new reminders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Tomorrow";
    if (diffDays < 0) return `In ${Math.abs(diffDays)} days`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Combine and prioritize reminders for compact display
  const prioritizedReminders = [
    ...data.overdue.slice(0, 3),
    ...data.due_today.slice(0, 3),
    ...data.due_this_week.slice(0, 2)
  ].slice(0, 5); // Show max 5 in panel

  return (
    <div className="w-96 bg-popover rounded-lg border shadow-lg max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notifications</h3>
          <Badge variant="secondary" className="text-xs">
            {totalDue}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {prioritizedReminders.map((reminder) => {
          const urgency = reminder.reminder_date < new Date().toISOString().split('T')[0] 
            ? REMINDER_URGENCIES.overdue
            : reminder.reminder_date === new Date().toISOString().split('T')[0]
            ? REMINDER_URGENCIES.today
            : REMINDER_URGENCIES.week;

          return (
            <div key={reminder.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="text-base">{urgency.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {reminder.Application.title_application}
                    </h4>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {reminder.Application.company}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(reminder.reminder_date)}</span>
                    <span>•</span>
                    <span>{reminder.Application.status.replace('_', ' ')}</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                      {reminder.Application.status === 'rejected' ? 'Re-apply' : 'Follow up'}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        {totalDue > prioritizedReminders.length && (
          <p className="text-xs text-muted-foreground text-center">
            +{totalDue - prioritizedReminders.length} more reminders
          </p>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild onClick={onClose}>
            <Link to="/reminders">
              <Calendar className="w-3 h-3 mr-1" />
              View All
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild onClick={onClose}>
            <Link to="/applications">
              <ExternalLink className="w-3 h-3 mr-1" />
              Applications
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;