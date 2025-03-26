import type { IApplication } from "@/pages/ApplicationsPage";
import { fetchApplications } from "@/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
function useApplications() {
	const { data, isLoading, error, refetch } = useQuery<IApplication[]>({
		queryKey: ["applications"],
		queryFn: fetchApplications,
	});
	return { applications: data ?? [], isLoading, error, refetch };
}

export default useApplications;
