import type { IApplication } from "../pages/ApplicationsPage";
import { createApplication } from "@/shared/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateApplication() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: ["applications"],
		mutationFn: (application: IApplication) => createApplication(application),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			queryClient.invalidateQueries({ queryKey: ["appsCount"] });
		},
		onError: (error) => {
			console.error("Failed to create application:", error);
		},
	});

	return mutation;
}
