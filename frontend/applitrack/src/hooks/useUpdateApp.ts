import type { IApplication } from "@/pages/ApplicationsPage";
import { updateApplication } from "@/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateApp() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: ["applications"],
		mutationFn: (application: IApplication) => updateApplication(application),
		onMutate: async (newApp) => {
			await queryClient.cancelQueries({ queryKey: ["applications"] });
			const previousApps = queryClient.getQueryData(["applications"]);
			queryClient.setQueryData(["applications"], (old: IApplication[] | undefined) =>
				old?.map(app => app.ID === newApp.ID ? newApp : app) ?? []
			);
			return { previousApps };
		},
		onError: (err, newApp, context) => {
			if (context?.previousApps) {
				queryClient.setQueryData(["applications"], context.previousApps);
			}
			console.error("Failed to update application:", err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			queryClient.invalidateQueries({ queryKey: ["appsCount"] });
		},
	});

	return mutation;
}
