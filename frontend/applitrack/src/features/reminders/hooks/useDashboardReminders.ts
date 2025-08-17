import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDueReminders } from "@/shared/utils/apiCalls";
import type { ReminderWithApplication } from "@/shared/types/api";
import type { ReminderDashboardData } from "../types/dashboard";

// Transform existing due reminders into urgency groups until backend endpoint is ready
const transformDueRemindersToGroups = (dueReminders?: ReminderWithApplication[]): ReminderDashboardData => {
  if (!dueReminders || dueReminders.length === 0) {
    return {
      overdue: [],
      due_today: [],
      due_this_week: [],
      total_pending: 0
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const overdue: ReminderWithApplication[] = [];
  const due_today: ReminderWithApplication[] = [];
  const due_this_week: ReminderWithApplication[] = [];

  dueReminders.forEach(reminder => {
    const reminderDate = new Date(reminder.reminder_date);
    const reminderDateOnly = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());

    if (reminderDateOnly < today) {
      overdue.push(reminder);
    } else if (reminderDateOnly.getTime() === today.getTime()) {
      due_today.push(reminder);
    } else if (reminderDateOnly <= oneWeekFromNow) {
      due_this_week.push(reminder);
    }
  });

  return {
    overdue,
    due_today,
    due_this_week,
    total_pending: dueReminders.length
  };
};

// Future endpoint call (will be implemented tomorrow)
const fetchDashboardReminders = async (): Promise<ReminderDashboardData> => {
  const response = await fetch('/api/reminders/dashboard', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Dashboard endpoint not ready yet');
  }
  
  return response.json();
};

export function useDashboardReminders() {
  // Try new endpoint first
  const dashboardQuery = useQuery<ReminderDashboardData>({
    queryKey: ['reminders', 'dashboard'],
    queryFn: fetchDashboardReminders,
    retry: false, // Don't retry if endpoint doesn't exist yet
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });

  // Fallback to existing endpoint
  const fallbackQuery = useQuery<ReminderWithApplication[]>({
    queryKey: ['reminders', 'due'],
    queryFn: fetchDueReminders,
    enabled: !dashboardQuery.data && !dashboardQuery.isFetching, // Only run if dashboard query failed
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Transform data and provide unified interface
  const data = useMemo(() => {
    if (dashboardQuery.data) {
      return dashboardQuery.data; // Use new endpoint data
    }
    if (fallbackQuery.data) {
      return transformDueRemindersToGroups(fallbackQuery.data); // Transform existing data
    }
    return null;
  }, [dashboardQuery.data, fallbackQuery.data]);

  const isLoading = dashboardQuery.isFetching || (fallbackQuery.isFetching && !dashboardQuery.data);
  const isError = dashboardQuery.isError && fallbackQuery.isError;
  const error = dashboardQuery.error || fallbackQuery.error;

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: () => {
      dashboardQuery.refetch();
      if (!dashboardQuery.data) {
        fallbackQuery.refetch();
      }
    },
    // Helper computed values
    hasOverdue: data ? data.overdue.length > 0 : false,
    hasDueToday: data ? data.due_today.length > 0 : false,
    totalDue: data ? data.total_pending : 0,
    urgentCount: data ? data.overdue.length + data.due_today.length : 0,
  };
}

export default useDashboardReminders;