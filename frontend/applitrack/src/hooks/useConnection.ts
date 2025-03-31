import { connectUser } from "@/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";

type UserInput = {
	email: string;
	password: string;
};

export function useConnection() {
	const mutation = useMutation({
		mutationKey: ["user"],
		mutationFn: ({ email, password }: UserInput) =>
			connectUser(email, password),
	});

	return mutation;
}
