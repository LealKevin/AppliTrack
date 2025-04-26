import type { IApplication } from "@/pages/ApplicationsPage";
import { fetchApplications, getAppsCount } from "@/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
import type { AppsCount } from "@/utils/apiCalls";

function useApplications(status: string) {
	const { data, isLoading, error, refetch } = useQuery<IApplication[]>({
		queryKey: ["applications", status],
		queryFn: () => fetchApplications(status),
	});

	const { data: appsCount } = useQuery<AppsCount>({
		queryKey: ["appsCount"],
		queryFn: () => getAppsCount(),
	});

	return { applications: data ?? [], isLoading, error, refetch, appsCount };
}

export default useApplications;
