import { createUser } from "@/shared/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";

type UserInput = {
	name: string;
	email: string;
	password: string;
	passwordRepeat: string;
};

export default function useCreateAccount() {
	const mutation = useMutation({
		mutationKey: ["users"],
		mutationFn: (user: UserInput) =>
			createUser(user.name, user.email, user.password, user.passwordRepeat),
		onError: (error) => {
			console.error("Failed to create account:", error);
		},
	});

	return mutation;
}
