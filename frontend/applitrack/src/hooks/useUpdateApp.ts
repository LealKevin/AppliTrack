import type { IApplication } from "@/pages/ApplicationsPage";
import { updateApplication } from "@/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateApp() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: ["applications"],
		mutationFn: (application: IApplication) => updateApplication(application),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["applications"] }),
	});

	return mutation;
}
