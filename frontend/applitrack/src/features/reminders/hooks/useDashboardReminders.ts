import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRemindersWithApplications } from "@/shared/utils/apiCalls";
import type { ReminderWithApplication } from "@/shared/types/api";
import type { ReminderDashboardData } from "../types/dashboard";

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

export function useDashboardReminders() {
  const remindersQuery = useQuery({
    queryKey: ['reminders', 'dashboard'],
    queryFn: fetchRemindersWithApplications,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const data = useMemo(() => {
    if (remindersQuery.data) {
      return {
        overdue: remindersQuery.data.overdue,
        due_today: remindersQuery.data.due_today,
        due_this_week: remindersQuery.data.due_this_week,
        total_pending: remindersQuery.data.total_pending
      } as ReminderDashboardData;
    }
    return null;
  }, [remindersQuery.data]);

  return {
    data,
    isLoading: remindersQuery.isLoading,
    isError: remindersQuery.isError,
    error: remindersQuery.error,
    refetch: remindersQuery.refetch,
    hasOverdue: data ? data.overdue.length > 0 : false,
    hasDueToday: data ? data.due_today.length > 0 : false,
    totalDue: data ? data.total_pending : 0,
    urgentCount: data ? data.overdue.length + data.due_today.length : 0,
  };
}

export default useDashboardReminders;