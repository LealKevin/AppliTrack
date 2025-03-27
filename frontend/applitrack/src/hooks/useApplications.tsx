import type { IApplication } from "@/pages/ApplicationsPage";
import { fetchApplications } from "@/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
function useApplications(status: string) {
	const { data, isLoading, error, refetch } = useQuery<IApplication[]>({
		queryKey: ["applications", status],
		queryFn: () => fetchApplications(status),
	});
	return { applications: data ?? [], isLoading, error, refetch };
}

export default useApplications;
