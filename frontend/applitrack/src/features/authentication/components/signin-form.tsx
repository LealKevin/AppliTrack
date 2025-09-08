import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import useCreateAccount from "../hooks/useCreateAccount";
import { registerSchema, useFormValidation } from "@/shared/validation";

function SigninForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
	const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);
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
			passwordRepeat: newPasswordRepeat,
			acceptedPrivacyPolicy,
			acceptedTerms
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

						{/* GDPR Consent Checkboxes */}
						<div className="space-y-4 pt-4 border-t">
							<div className="flex items-start space-x-3">
								<input
									type="checkbox"
									id="privacy-policy"
									checked={acceptedPrivacyPolicy}
									onChange={(e) => setAcceptedPrivacyPolicy(e.target.checked)}
									className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<label htmlFor="privacy-policy" className="text-sm text-gray-700">
									I accept the{" "}
									<Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
										Privacy Policy
									</Link>
									{" "}and consent to the processing of my personal data.
								</label>
							</div>
							{getFieldError("acceptedPrivacyPolicy") && (
								<span className="text-sm text-red-600 ml-7">{getFieldError("acceptedPrivacyPolicy")}</span>
							)}

							<div className="flex items-start space-x-3">
								<input
									type="checkbox"
									id="terms-service"
									checked={acceptedTerms}
									onChange={(e) => setAcceptedTerms(e.target.checked)}
									className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<label htmlFor="terms-service" className="text-sm text-gray-700">
									I agree to the{" "}
									<Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
										Terms of Service
									</Link>
								</label>
							</div>
							{getFieldError("acceptedTerms") && (
								<span className="text-sm text-red-600 ml-7">{getFieldError("acceptedTerms")}</span>
							)}

							<p className="text-xs text-gray-500 ml-7">
								Learn more about our{" "}
								<Link to="/cookie-policy" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
									Cookie Policy
								</Link>
							</p>
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
