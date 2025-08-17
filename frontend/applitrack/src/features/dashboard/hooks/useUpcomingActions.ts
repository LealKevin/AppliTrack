import { useQuery } from "@tanstack/react-query";
import { fetchInterviewApplications, fetchDueReminders } from "@/shared/utils/apiCalls";
import type { InterviewApplication, ReminderWithApplication } from "@/shared/types/api";

export interface UpcomingAction {
  id: string;
  type: 'interview' | 'reminder';
  title: string;
  company: string;
  date: string;
  urgency: 'overdue' | 'today' | 'this_week' | 'later';
}

function useUpcomingActions() {
  // Get interview applications
  const interviewsQuery = useQuery<InterviewApplication[]>({
    queryKey: ["interviews"],
    queryFn: fetchInterviewApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get due reminders
  const remindersQuery = useQuery<ReminderWithApplication[]>({
    queryKey: ["dueReminders"],
    queryFn: fetchDueReminders,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = interviewsQuery.isLoading || remindersQuery.isLoading;
  const error = interviewsQuery.error || remindersQuery.error;

  // Process upcoming actions
  const upcomingActions: UpcomingAction[] = (() => {
    if (!interviewsQuery.data || !remindersQuery.data) {
      return [];
    }

    const actions: UpcomingAction[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekEnd = new Date(today);
    thisWeekEnd.setDate(today.getDate() + 7);

    // Process reminders
    remindersQuery.data.forEach(reminder => {
      const reminderDate = new Date(reminder.reminder_date);
      const reminderDateOnly = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
      
      let urgency: UpcomingAction['urgency'] = 'later';
      if (reminderDateOnly < today) {
        urgency = 'overdue';
      } else if (reminderDateOnly.getTime() === today.getTime()) {
        urgency = 'today';
      } else if (reminderDateOnly <= thisWeekEnd) {
        urgency = 'this_week';
      }

      actions.push({
        id: reminder.id,
        type: 'reminder',
        title: `Follow up on ${reminder.Application.title_application}`,
        company: reminder.Application.company,
        date: reminder.reminder_date,
        urgency
      });
    });

    // Process interviews - look for rounds with scheduled dates
    interviewsQuery.data.forEach(app => {
      app.Rounds?.forEach(round => {
        if (round.date && round.status === 'scheduled') {
          const roundDate = new Date(round.date);
          const roundDateOnly = new Date(roundDate.getFullYear(), roundDate.getMonth(), roundDate.getDate());
          
          let urgency: UpcomingAction['urgency'] = 'later';
          if (roundDateOnly < today) {
            urgency = 'overdue';
          } else if (roundDateOnly.getTime() === today.getTime()) {
            urgency = 'today';
          } else if (roundDateOnly <= thisWeekEnd) {
            urgency = 'this_week';
          }

          const roundTypeDisplay = round.type.replace('_', ' ').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          actions.push({
            id: round.id,
            type: 'interview',
            title: `${roundTypeDisplay} interview`,
            company: app.Application.company,
            date: round.date,
            urgency
          });
        }
      });
    });

    // Sort by date
    return actions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  })();

  // Get actions for this week
  const thisWeekActions = upcomingActions.filter(action => 
    action.urgency === 'overdue' || action.urgency === 'today' || action.urgency === 'this_week'
  ).slice(0, 5); // Limit to 5 most urgent

  return {
    data: upcomingActions,
    thisWeekActions,
    isLoading,
    error,
    refetch: () => {
      interviewsQuery.refetch();
      remindersQuery.refetch();
    }
  };
}

export default useUpcomingActions;