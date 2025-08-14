import { useQuery } from "@tanstack/react-query";
import { fetchInterviewApplications } from "@/shared/utils/apiCalls";
import type { InterviewApplication } from "@/shared/types/api";

// Get all applications that are in interview stages (interview_scheduled, interviewing)
export function useInterviewApplications() {
  return useQuery<InterviewApplication[]>({
    queryKey: ["interviewApplications"],
    queryFn: fetchInterviewApplications,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter since this is more time-sensitive)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default useInterviewApplications;
