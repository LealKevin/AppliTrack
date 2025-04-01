import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useCreateAccount } from "@/hooks/useCreateAccount";

export function SigninForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

	const navigate = useNavigate();
	const { mutate: createAccount } = useCreateAccount();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createAccount(
			{
				email: newEmail,
				password: newPassword,
				name: newName,
				passwordRepeat: newPasswordRepeat,
			},
			{
				onSuccess: () => {
					navigate("/applications");
				},
				onError: (err) => {
					console.error("Login failed", err);
				},
			},
		);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Create new account</CardTitle>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-2">
						<div className="grid gap-3">
							<Label htmlFor="email">Name</Label>
							<Input
								onChange={(e) => setNewName(e.currentTarget.value)}
								id="name"
								placeholder="Your name"
							/>
						</div>

						<div className="grid gap-3">
							<Label htmlFor="email">E-mail</Label>
							<Input
								onChange={(e) => setNewEmail(e.currentTarget.value)}
								id="email"
								placeholder="Your email"
							/>
						</div>

						<div className="grid gap-3">
							<Label htmlFor="password">Password</Label>
							<Input
								onChange={(e) => setNewPassword(e.currentTarget.value)}
								type="password"
								id="password"
								placeholder="Your password"
							/>
						</div>

						<div className="grid gap-3">
							<Label htmlFor="passwordRepeat">Repeat password</Label>
							<Input
								onChange={(e) => setNewPasswordRepeat(e.currentTarget.value)}
								type="password"
								id="passwordRepeat"
								placeholder="Re-enter password"
							/>
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
