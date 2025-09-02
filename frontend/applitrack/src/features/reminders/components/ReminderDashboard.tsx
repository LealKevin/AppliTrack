import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Bell, BellRing, Calendar, CheckCircle2 } from "lucide-react";
import ReminderCard from "./ReminderCard";
import useDashboardReminders from "../hooks/useDashboardReminders";
import { REMINDER_URGENCIES } from "../types/dashboard";

function ReminderDashboard() {
  const { data, isLoading, totalDue, urgentCount } = useDashboardReminders();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Reminders</h2>
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // No reminders state
  if (!data || totalDue === 0) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Reminders</h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/applications">Set Reminders</Link>
          </Button>
        </div>
        
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-medium text-muted-foreground mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground">
            You have no pending reminders. Set reminders on your applications to stay on top of follow-ups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {urgentCount > 0 ? (
            <BellRing className="h-5 w-5 text-orange-500" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          <h2 className="text-lg font-semibold">Reminders</h2>
          
          {urgentCount > 0 && (
            <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
              {urgentCount} urgent
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalDue} total
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link to="/reminders">View All</Link>
          </Button>
        </div>
      </div>

      {/* Reminder Groups */}
      <div className="space-y-6">
        {/* Overdue - Highest Priority */}
        {data.overdue.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                {REMINDER_URGENCIES.overdue.icon} {REMINDER_URGENCIES.overdue.label} ({data.overdue.length})
              </span>
            </div>
            <div className="space-y-3">
              {data.overdue.slice(0, 3).map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  urgency={REMINDER_URGENCIES.overdue}
                />
              ))}
              {data.overdue.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/reminders">
                      View {data.overdue.length - 3} more overdue reminders
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Due Today */}
        {data.due_today.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">
                {REMINDER_URGENCIES.today.icon} {REMINDER_URGENCIES.today.label} ({data.due_today.length})
              </span>
            </div>
            <div className="space-y-3">
              {data.due_today.slice(0, 2).map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  urgency={REMINDER_URGENCIES.today}
                />
              ))}
              {data.due_today.length > 2 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/reminders">
                      View {data.due_today.length - 2} more due today
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Due This Week - Only show if no urgent items or if there's space */}
        {data.due_this_week.length > 0 && (urgentCount === 0 || urgentCount < 3) && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                {REMINDER_URGENCIES.week.icon} {REMINDER_URGENCIES.week.label} ({data.due_this_week.length})
              </span>
            </div>
            <div className="space-y-3">
              {data.due_this_week.slice(0, urgentCount === 0 ? 3 : 1).map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  urgency={REMINDER_URGENCIES.week}
                />
              ))}
              {data.due_this_week.length > (urgentCount === 0 ? 3 : 1) && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/reminders">
                      View all upcoming reminders
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {totalDue > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Next follow-up opportunities</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/reminders">Manage all reminders</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReminderDashboard;