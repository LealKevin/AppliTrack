import { useQuery } from '@tanstack/react-query';
import { fetchUserReminders } from '@/shared/utils/apiCalls';
import { fetchApplications } from '@/shared/utils/apiCalls';
import type { ReminderWithApplication, Reminder, InterviewApplication } from '@/shared/types/api';

export const useRemindersWithApplications = () => {
  const remindersQuery = useQuery({
    queryKey: ["reminders"],
    queryFn: fetchUserReminders,
  });

  const applicationsQuery = useQuery<InterviewApplication[]>({
    queryKey: ["applications"],
    queryFn: () => fetchApplications(""), // Fetch all applications
  });

  // Debug logging
  console.log('useRemindersWithApplications - reminders:', remindersQuery.data);
  console.log('useRemindersWithApplications - applications:', applicationsQuery.data);
  console.log('Application IDs in array:', applicationsQuery.data?.map(app => app.Application.id));

  // Combine reminders with application data
  const remindersWithApplications: ReminderWithApplication[] = 
    remindersQuery.data?.map((reminder: Reminder) => {
      console.log('Looking for application with ID:', reminder.application_id);
      const interviewApp = applicationsQuery.data?.find(
        (app: InterviewApplication) => app.Application.id === reminder.application_id
      );
      const application = interviewApp?.Application;
      console.log('Found application:', application);
      
      return {
        ...reminder,
        Application: application || {
          id: reminder.application_id,
          title_application: 'Unknown Application',
          company: 'Unknown Company',
          location: '',
          sent_date: '',
          status: 'sent',
          notes: '',
          url_application: '',
          created_at: '',
          updated_at: ''
        }
      } as ReminderWithApplication;
    }) || [];

  return {
    reminders: remindersWithApplications,
    isLoading: remindersQuery.isLoading || applicationsQuery.isLoading,
    error: remindersQuery.error || applicationsQuery.error,
    refetch: () => {
      remindersQuery.refetch();
      applicationsQuery.refetch();
    }
  };
};