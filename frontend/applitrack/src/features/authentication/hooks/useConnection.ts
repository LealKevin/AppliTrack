import { connectUser } from "@/shared/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type UserInput = {
	email: string;
	password: string;
};

export default function useConnection() {
	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: (input: UserInput) => connectUser(input),
		onSuccess: () => {
			toast.success("Welcome back! You're now logged in");
		},
		onError: (error) => {
			toast.error("Login failed. Please check your credentials");
			console.error("Failed to login:", error);
		},
	});

	return mutation;
}
