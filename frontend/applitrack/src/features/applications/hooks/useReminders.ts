import type { Reminder, CreateReminderRequest, UpdateReminderRequest, ReminderWithApplication } from "@/shared/types/api";
import { 
  createReminder, 
  fetchUserReminders, 
  updateReminder, 
  completeReminder, 
  deleteReminder, 
  fetchDueReminders 
} from "@/shared/utils/apiCalls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReminders() {
  const queryClient = useQueryClient();

  // Get all user reminders
  const reminders = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: fetchUserReminders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });

  // Get due reminders with application data
  const dueReminders = useQuery<ReminderWithApplication[]>({
    queryKey: ["reminders", "due"],
    queryFn: fetchDueReminders,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for notifications)
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      // Invalidate both reminder queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  // Update reminder mutation (for snooze functionality)
  const updateReminderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderRequest }) =>
      updateReminder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  // Complete reminder mutation
  const completeReminderMutation = useMutation({
    mutationFn: completeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  // Delete reminder mutation
  const deleteReminderMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  return {
    // Data
    reminders: reminders.data ?? [],
    dueReminders: dueReminders.data ?? [],
    
    // Loading states
    isLoading: reminders.isLoading || dueReminders.isLoading,
    isError: reminders.isError || dueReminders.isError,
    error: reminders.error || dueReminders.error,
    
    // Refetch functions
    refetchReminders: reminders.refetch,
    refetchDueReminders: dueReminders.refetch,
    
    // Mutations
    createReminder: createReminderMutation,
    updateReminder: updateReminderMutation,
    completeReminder: completeReminderMutation,
    deleteReminder: deleteReminderMutation,
    
    // Utility functions
    createReminderForApplication: (applicationId: string, date: string) => {
      const reminderData: CreateReminderRequest = {
        reminder_date: date,
        status: 'pending', // Always pending when created
        application_id: applicationId,
      };
      return createReminderMutation.mutate(reminderData);
    },
    
    snoozeReminder: (reminderId: string, newDate: string) => {
      return updateReminderMutation.mutate({
        id: reminderId,
        data: {
          reminder_date: newDate,
          status: 'pending', // Keep as pending when snoozed
        },
      });
    },
  };
}

export default useReminders;