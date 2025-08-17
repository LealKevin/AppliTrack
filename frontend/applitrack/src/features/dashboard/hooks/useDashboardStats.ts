import { useQuery } from "@tanstack/react-query";
import { fetchApplications, getAppsCount, fetchUserReminders } from "@/shared/utils/apiCalls";
import type { ApplicationCounts, InterviewApplication, Reminder } from "@/shared/types/api";

export interface DashboardStats {
  // Application metrics
  totalApplications: number;
  applicationsThisWeek: number;
  responseRate: number;
  
  // Status breakdown
  statusCounts: ApplicationCounts;
  
  // Reminders
  activeReminders: number;
  
  // Recent activity
  recentApplications: number; // Applications in last 7 days
}

function useDashboardStats() {
  // Get all applications to calculate metrics
  const applicationsQuery = useQuery<InterviewApplication[]>({
    queryKey: ["applications", ""],
    queryFn: () => fetchApplications(""),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get application counts by status
  const countsQuery = useQuery<ApplicationCounts>({
    queryKey: ["appsCount"],
    queryFn: getAppsCount,
    staleTime: 5 * 60 * 1000,
  });

  // Get reminders
  const remindersQuery = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: fetchUserReminders,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = applicationsQuery.isLoading || countsQuery.isLoading || remindersQuery.isLoading;
  const error = applicationsQuery.error || countsQuery.error || remindersQuery.error;

  // Calculate dashboard stats
  const dashboardStats: DashboardStats | null = (() => {
    if (!applicationsQuery.data || !countsQuery.data || !remindersQuery.data) {
      return null;
    }

    const applications = applicationsQuery.data.map(app => app.Application);
    const statusCounts = countsQuery.data;
    const reminders = remindersQuery.data;

    // Calculate applications this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const applicationsThisWeek = applications.filter(app => {
      const sentDate = new Date(app.sent_date);
      return sentDate >= oneWeekAgo;
    }).length;

    // Calculate recent applications (last 7 days)
    const recentApplications = applicationsThisWeek;

    // Calculate response rate (interviews + offers / sent applications)
    const totalSent = statusCounts.sent_count;
    const responses = statusCounts.interview_scheduled_count + 
                     statusCounts.interviewing_count + 
                     statusCounts.offer_count;
    const responseRate = totalSent > 0 ? Math.round((responses / totalSent) * 100) : 0;

    // Count active (pending) reminders
    const activeReminders = reminders.filter(reminder => reminder.status === "pending").length;

    return {
      totalApplications: statusCounts.all_count,
      applicationsThisWeek,
      responseRate,
      statusCounts,
      activeReminders,
      recentApplications,
    };
  })();

  return {
    data: dashboardStats,
    isLoading,
    error,
    refetch: () => {
      applicationsQuery.refetch();
      countsQuery.refetch();
      remindersQuery.refetch();
    }
  };
}

export default useDashboardStats;