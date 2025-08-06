import type { IApplication } from "../pages/ApplicationsPage";
import { fetchApplications, getAppsCount } from "@/shared/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
import type { AppsCount } from "@/shared/utils/apiCalls";

function useApplications(status: string = "") {
	const applications = useQuery<IApplication[]>({
		queryKey: ["applications", status],
		queryFn: () => fetchApplications(status),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	const appsCount = useQuery<AppsCount>({
		queryKey: ["appsCount"],
		queryFn: getAppsCount,
		staleTime: 5 * 60 * 1000,
	});

	return {
		applications: applications.data ?? [],
		isLoading: applications.isLoading || appsCount.isLoading,
		error: applications.error || appsCount.error,
		refetch: applications.refetch,
		appsCount: appsCount.data,
		isError: applications.isError || appsCount.isError,
		isFetching: applications.isFetching || appsCount.isFetching,
	};
}

export default useApplications;
