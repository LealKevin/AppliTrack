import { fetchApplicationsByStatus } from "@/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

export default function useApplicationsByStatus(status: string) {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["applications"],
		queryFn: () => fetchApplicationsByStatus(status),
	});

	return { applications: data ?? [], isLoading, error, refetch };
}
