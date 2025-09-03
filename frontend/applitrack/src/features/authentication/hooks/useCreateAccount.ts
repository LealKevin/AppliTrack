import { createUser } from "@/shared/utils/apiCalls";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
		onSuccess: () => {
			toast.success("Account created successfully! Welcome aboard!");
		},
		onError: (error) => {
			toast.error("Failed to create account. Please try again");
			console.error("Failed to create account:", error);
		},
	});

	return mutation;
}
