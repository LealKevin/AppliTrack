import { logoutUser } from "@/shared/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useDisconnection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: () => logoutUser(),
		onSuccess: () => {
			toast.success("You've been logged out successfully");
			queryClient.clear();
			navigate("/login");
		},
		onError: (error) => {
			toast.error("Failed to logout. Please try again");
			console.error("Failed to logout:", error);
		},
	});
	return mutation;
}
