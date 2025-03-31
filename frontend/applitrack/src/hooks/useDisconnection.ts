import { logoutUser } from "@/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDisconnection() {
	console.log("here");
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: () => logoutUser(),
		onSuccess: () => {
			queryClient.clear();
		},
		onError: (error) => {
			console.error("Erreur lors de la suppression de l'application :", error);
		},
	});
	return mutation;
}
