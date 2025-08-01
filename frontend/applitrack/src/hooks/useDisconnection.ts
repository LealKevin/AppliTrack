import { logoutUser } from "@/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function useDisconnection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: () => logoutUser(),
		onSuccess: () => {
			queryClient.clear();
			navigate("/login");
		},
		onError: (error) => {
			console.error("Failed to logout:", error);
		},
	});
	return mutation;
}
