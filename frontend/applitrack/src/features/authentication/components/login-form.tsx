import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema, useFormValidation } from "@/shared/validation";

function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [connectEmail, setConnectEmail] = useState("");
	const [connectPassword, setConnectPassword] = useState("");
	const [serverError, setServerError] = useState<string | null>(null);

	const navigate = useNavigate();
	const { login } = useAuth();
	const { validate, getFieldError, clearErrors } = useFormValidation(loginSchema);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearErrors();
		setServerError(null);

		const formData = { email: connectEmail, password: connectPassword };
		const validation = validate(formData);

		if (!validation.success) {
			return; // Validation errors will be displayed via getFieldError
		}

		try {
			await login(validation.data!);
			navigate("/applications");
		} catch (error: any) {
			console.error("Unable to login: ", error);
			
			// Handle specific error responses
			if (error?.response?.status === 401) {
				setServerError("Invalid email or password. Please try again.");
			} else if (error?.response?.status === 400) {
				setServerError("Invalid input. Please check your information.");
			} else {
				setServerError("Login failed. Please try again later.");
			}
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
					{serverError && (
						<div className="text-sm text-red-600 text-center p-3 bg-red-50 rounded-md border border-red-200">
							{serverError}
						</div>
					)}
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									onChange={(e) => setConnectEmail(e.currentTarget.value)}
									id="email"
									type="email"
									placeholder="m@example.com"
									className={getFieldError("email") ? "border-red-500" : ""}
								/>
								{getFieldError("email") && (
									<span className="text-sm text-red-600">{getFieldError("email")}</span>
								)}
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
								</div>

								<Input
									onChange={(e) => setConnectPassword(e.currentTarget.value)}
									id="password"
									type="password"
									className={getFieldError("password") ? "border-red-500" : ""}
								/>
								{getFieldError("password") && (
									<span className="text-sm text-red-600">{getFieldError("password")}</span>
								)}
							</div>

							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
						</div>
						<div className=" mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<a href="/signin" className="underline underline-offset-4">
								Sign up
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default LoginForm;
