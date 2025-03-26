import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "@/utils/apiCalls";

export function useDeleteApp() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (id: number) => deleteApplication(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
		},
		onError: (error) => {
			console.error("Erreur lors de la suppression de l'application :", error);
		},
	});
	return mutation;
}
