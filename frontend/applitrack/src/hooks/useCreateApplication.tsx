import type { IApplication } from "@/pages/ApplicationsPage";
import { createApplication } from "@/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";

export default function useCreateApplication() {
	const mutation = useMutation({
		mutationKey: ["applciations"],
		mutationFn: (application: IApplication) => createApplication(application),
	});

	return mutation;
}
