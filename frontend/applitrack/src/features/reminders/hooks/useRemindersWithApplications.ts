import { useQuery } from '@tanstack/react-query';
import { fetchRemindersWithApplications } from '@/shared/utils/apiCalls';
import type { ReminderWithApplication } from '@/shared/types/api';

export const useRemindersWithApplications = () => {
  const remindersQuery = useQuery({
    queryKey: ["reminders-with-applications"],
    queryFn: fetchRemindersWithApplications,
  });

  // Flatten all categorized reminders into a single array
  const allReminders: ReminderWithApplication[] = remindersQuery.data 
    ? [
        ...remindersQuery.data.overdue,
        ...remindersQuery.data.due_today,
        ...remindersQuery.data.due_this_week
      ]
    : [];

  return {
    reminders: allReminders,
    isLoading: remindersQuery.isLoading,
    error: remindersQuery.error,
    refetch: remindersQuery.refetch
  };
};