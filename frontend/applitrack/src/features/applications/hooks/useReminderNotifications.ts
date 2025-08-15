import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReminderWithApplication } from "@/shared/types/api";
import { fetchDueReminders } from "@/shared/utils/apiCalls";
import useToast from "@/shared/hooks/useToast";
import useReminders from "./useReminders";

// Store shown notification IDs to prevent duplicates
const shownNotifications = new Set<string>();

export function useReminderNotifications() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { completeReminder, snoozeReminder } = useReminders();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Query for due reminders with shorter stale time for real-time notifications
  const dueRemindersQuery = useQuery<ReminderWithApplication[]>({
    queryKey: ["reminders", "due"],
    queryFn: fetchDueReminders,
    staleTime: 1 * 60 * 1000, // 1 minute - check frequently for due reminders
    gcTime: 2 * 60 * 1000,    // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });

  const dueReminders = dueRemindersQuery.data ?? [];

  // Show notification for new due reminders
  useEffect(() => {
    if (!dueReminders.length) return;

    dueReminders.forEach((reminder) => {
      // Skip if we already showed notification for this reminder
      if (shownNotifications.has(reminder.id)) return;

      // Mark as shown to prevent duplicates
      shownNotifications.add(reminder.id);

      // Create rich notification toast
      showReminderNotification(reminder);
    });
  }, [dueReminders]);

  const showReminderNotification = (reminder: ReminderWithApplication) => {
    const app = reminder.Application;
    
    // Show a simple notification toast
    toast.info(
      `⏰ Reminder: Follow up on your ${app.title_application} application at ${app.company}!`
    );

    // Emit custom event for ApplicationsPage to show the reminder modal/actions
    window.dispatchEvent(new CustomEvent('reminder-due', {
      detail: { reminder }
    }));
  };

  const handleReApply = (reminder: ReminderWithApplication) => {
    // Emit custom event that ApplicationsPage can listen to
    window.dispatchEvent(new CustomEvent('reminder-reapply', {
      detail: { reminder }
    }));
    
    // Mark reminder as completed
    completeReminder.mutate(reminder.id, {
      onSuccess: () => {
        toast.success("Opening re-apply form...");
        // Remove from shown notifications so it doesn't show again
        shownNotifications.delete(reminder.id);
        // Refresh due reminders
        queryClient.invalidateQueries({ queryKey: ["reminders", "due"] });
      }
    });
  };

  const handleSnooze = (reminder: ReminderWithApplication, days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    
    snoozeReminder(reminder.id, newDate.toISOString().split('T')[0]);
    
    const label = days === 7 ? "1 week" : days === 14 ? "2 weeks" : days === 30 ? "1 month" : `${days} days`;
    toast.success(`Reminder snoozed for ${label}`);
    
    // Remove from shown notifications
    shownNotifications.delete(reminder.id);
    // Refresh due reminders
    queryClient.invalidateQueries({ queryKey: ["reminders", "due"] });
  };

  const handleMarkDone = (reminder: ReminderWithApplication) => {
    completeReminder.mutate(reminder.id, {
      onSuccess: () => {
        toast.success("Reminder marked as completed");
        // Remove from shown notifications
        shownNotifications.delete(reminder.id);
        // Refresh due reminders
        queryClient.invalidateQueries({ queryKey: ["reminders", "due"] });
      }
    });
  };

  // Start periodic checking when component mounts
  useEffect(() => {
    // Initial check
    dueRemindersQuery.refetch();

    // Set up periodic checking every 5 minutes
    intervalRef.current = setInterval(() => {
      dueRemindersQuery.refetch();
    }, 5 * 60 * 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Check for due reminders on window focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      dueRemindersQuery.refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return {
    dueReminders,
    isLoading: dueRemindersQuery.isLoading,
    error: dueRemindersQuery.error,
    refetch: dueRemindersQuery.refetch,
    
    // Utility functions for external components to use
    handleReApply,
    handleSnooze,
    handleMarkDone,
    checkForDueReminders: () => dueRemindersQuery.refetch(),
    clearShownNotifications: () => shownNotifications.clear(),
  };
}

export default useReminderNotifications;