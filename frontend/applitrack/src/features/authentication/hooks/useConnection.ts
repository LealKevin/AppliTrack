import { connectUser } from "@/shared/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";

export type UserInput = {
	email: string;
	password: string;
};

export default function useConnection() {
	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: (input: UserInput) => connectUser(input),
		onError: (error) => {
			console.error("Failed to login:", error);
		},
	});

	return mutation;
}
