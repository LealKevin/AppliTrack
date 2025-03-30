import { createUser } from "@/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";

type UserInput = {
	name: string;
	email: string;
	password: string;
	passwordRepeat: string;
};

export function useCreateAccount() {
	console.log("useCreateAccount");
	const mutation = useMutation({
		mutationKey: ["users"],
		mutationFn: (user: UserInput) =>
			createUser(user.name, user.email, user.password, user.passwordRepeat),
	});

	return mutation;
}
