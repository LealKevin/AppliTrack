import { connectUser } from "@/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";

export type UserInput = {
	email: string;
	password: string;
};

export function useConnection() {
	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: (input: UserInput) => connectUser(input),
	});

	return mutation;
}
