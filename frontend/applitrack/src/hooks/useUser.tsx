import { getUser } from "@/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
	const data = useQuery({
		queryKey: ["user"],
		queryFn: () => getUser(),
	});

	return data;
}
