import type { IApplication } from "@/pages/ApplicationsPage";
import { createApplication } from "@/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateApplication() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: ["applciations"],
		mutationFn: (application: IApplication) => createApplication(application),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["applications"] }),
	});

	return mutation;
}
