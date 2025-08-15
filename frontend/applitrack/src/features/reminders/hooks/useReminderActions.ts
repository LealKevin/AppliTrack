import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeReminder, updateReminder } from "@/shared/utils/apiCalls";
import type { ReminderWithApplication } from "@/shared/types/api";
import useToast from "@/shared/hooks/useToast";

export function useReminderActions() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Mark reminder as completed
  const markDoneMutation = useMutation({
    mutationFn: completeReminder,
    onSuccess: () => {
      toast.success("Reminder marked as completed");
      // Invalidate all reminder queries
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error) => {
      toast.error("Failed to complete reminder");
      console.error("Complete reminder error:", error);
    }
  });

  // Snooze reminder for specified number of days
  const snoozeMutation = useMutation({
    mutationFn: ({ reminderId, days }: { reminderId: string; days: number }) => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
      
      return updateReminder(reminderId, {
        reminder_date: newDate.toISOString().split('T')[0], // YYYY-MM-DD format
        status: 'pending'
      });
    },
    onSuccess: (_, variables) => {
      const daysLabel = variables.days === 1 ? "1 day" : 
                       variables.days === 7 ? "1 week" : 
                       variables.days === 30 ? "1 month" : 
                       `${variables.days} days`;
      toast.success(`Reminder snoozed for ${daysLabel}`);
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: (error) => {
      toast.error("Failed to snooze reminder");
      console.error("Snooze reminder error:", error);
    }
  });

  // Quick action functions
  const markDone = (reminderId: string) => {
    markDoneMutation.mutate(reminderId);
  };

  const snooze = (reminderId: string, days: number) => {
    snoozeMutation.mutate({ reminderId, days });
  };

  // Snooze presets
  const snoozeOptions = [
    { label: "1 day", days: 1 },
    { label: "1 week", days: 7 },
    { label: "1 month", days: 30 }
  ];

  // Re-apply action (emits event for application modal)
  const reApply = (reminder: ReminderWithApplication) => {
    // Emit custom event that ApplicationsTablePage can listen to
    window.dispatchEvent(new CustomEvent('reminder-reapply', {
      detail: { reminder }
    }));
    
    // Mark reminder as completed since user is taking action
    markDone(reminder.id);
  };

  return {
    // Actions
    markDone,
    snooze,
    reApply,
    
    // Presets
    snoozeOptions,
    
    // Loading states
    isMarkingDone: markDoneMutation.isPending,
    isSnoozing: snoozeMutation.isPending,
    
    // Utility
    isActionPending: markDoneMutation.isPending || snoozeMutation.isPending
  };
}

export default useReminderActions;