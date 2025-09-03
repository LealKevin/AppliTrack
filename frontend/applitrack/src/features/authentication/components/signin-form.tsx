import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useNavigate } from "react-router-dom";
import useCreateAccount from "../hooks/useCreateAccount";
import { registerSchema, useFormValidation } from "@/shared/validation";

function SigninForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
	const [serverError, setServerError] = useState<string | null>(null);

	const navigate = useNavigate();
	const { mutate: createAccount } = useCreateAccount();
	const { validate, getFieldError, clearErrors } = useFormValidation(registerSchema);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		clearErrors();
		setServerError(null);

		const formData = {
			email: newEmail,
			password: newPassword,
			passwordRepeat: newPasswordRepeat
		};
		
		const validation = validate(formData);

		if (!validation.success) {
			return; // Validation errors will be displayed via getFieldError
		}

		createAccount(
			{
				email: validation.data!.email,
				password: validation.data!.password,
				name: "",
				passwordRepeat: validation.data!.passwordRepeat,
			},
			{
				onSuccess: () => {
					navigate("/applications");
				},
				onError: (err: any) => {
					console.error("Registration failed", err);
					
					// Handle specific error responses
					if (err?.response?.status === 409) {
						setServerError("Email already exists. Please use a different email address.");
					} else if (err?.response?.status === 400) {
						setServerError("Invalid input. Please check your information and try again.");
					} else {
						setServerError("Registration failed. Please try again later.");
					}
				},
			},
		);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Create new account</CardTitle>
					{serverError && (
						<div className="text-sm text-red-600 text-center p-3 bg-red-50 rounded-md border border-red-200">
							{serverError}
						</div>
					)}
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-2">

						<div className="grid gap-3">
							<Label htmlFor="email">E-mail</Label>
							<Input
								onChange={(e) => setNewEmail(e.currentTarget.value)}
								id="email"
								placeholder="Your email"
								className={getFieldError("email") ? "border-red-500" : ""}
							/>
							{getFieldError("email") && (
								<span className="text-sm text-red-600">{getFieldError("email")}</span>
							)}
						</div>

						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								onChange={(e) => setNewPassword(e.currentTarget.value)}
								type="password"
								id="password"
								placeholder="Your password"
								className={getFieldError("password") ? "border-red-500" : ""}
							/>
							{getFieldError("password") && (
								<span className="text-sm text-red-600">{getFieldError("password")}</span>
							)}
						</div>

						<div className="grid gap-3">
							<Label htmlFor="passwordRepeat">Repeat password</Label>
							<Input
								onChange={(e) => setNewPasswordRepeat(e.currentTarget.value)}
								type="password"
								id="passwordRepeat"
								placeholder="Re-enter password"
								className={getFieldError("passwordRepeat") ? "border-red-500" : ""}
							/>
							{getFieldError("passwordRepeat") && (
								<span className="text-sm text-red-600">{getFieldError("passwordRepeat")}</span>
							)}
						</div>
						<div className=" mt-4 flex flex-col gap-3">
							<Button type="submit" className="w-full">
								Create account
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Already have an account{" "}
							<a href="/" className="underline underline-offset-4">
								Login
							</a>
						</div>
					</CardContent>
				</form>
			</Card>
		</div>
	);
}

export default SigninForm;
