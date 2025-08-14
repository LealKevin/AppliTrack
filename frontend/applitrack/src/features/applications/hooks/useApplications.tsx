import type { IApplication, ApplicationCounts, InterviewApplication } from "@/shared/types/api";
import { fetchApplications, getAppsCount } from "@/shared/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

function useApplications(status: string = "") {
	const applications = useQuery<InterviewApplication[]>({
		queryKey: ["applications", status],
		queryFn: () => fetchApplications(status),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	const appsCount = useQuery<ApplicationCounts>({
		queryKey: ["appsCount"],
		queryFn: getAppsCount,
		staleTime: 5 * 60 * 1000,
	});

	return {
		applications: applications.data?.map(app => app.Application) ?? [],
		isLoading: applications.isLoading || appsCount.isLoading,
		error: applications.error || appsCount.error,
		refetch: applications.refetch,
		appsCount: appsCount.data,
		isError: applications.isError || appsCount.isError,
		isFetching: applications.isFetching || appsCount.isFetching,
	};
}

export default useApplications;
