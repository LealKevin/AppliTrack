import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { TabsContent, TabsTrigger, Tabs, TabsList } from "./ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "./ui/card";
import { useState } from "react";
import { useCreateAccount } from "@/hooks/useCreateAccount";

type UserConnectionModalProps = {
	isModalOpen: boolean;
	handleClose: () => void;
	connectionSubmit: () => void;
	createAccountSubmit: () => void;
};

export function UserConnectionModal({
	isModalOpen,
	handleClose,
	connectionSubmit,
}: UserConnectionModalProps) {
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

	const newUser = {
		name: newName,
		email: newEmail,
		password: newPassword,
		passwordRepeat: newPasswordRepeat,
	};

	const { mutate: createAccount } = useCreateAccount();

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleClose();
				}
			}}
		>
			<DialogTitle>Settings</DialogTitle>
			<DialogContent className="justify-center">
				<Tabs defaultValue="connection" className="w-[425px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="connection">Connection</TabsTrigger>
						<TabsTrigger value="createAccount">Create an account</TabsTrigger>
					</TabsList>

					<TabsContent onSubmit={connectionSubmit} value="connection">
						<Card>
							<CardHeader>
								<CardDescription className="text-center">
									Connection with your existing account.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="space-y-1">
									<Label htmlFor="email">E-mail</Label>
									<Input id="email" placeholder="Your email" />
								</div>
								<div className="space-y-1">
									<Label htmlFor="password">Password</Label>
									<Input
										type="password"
										id="password"
										placeholder="Your password"
									/>
								</div>
							</CardContent>
							<CardFooter className=" space-x-2">
								<Button variant={"outline"}>Cancel</Button>
								<Button type="submit">Connection</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value="createAccount">
						<Card>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									console.log("creating account:", newUser);
									createAccount(newUser);
								}}
							>
								<CardHeader>
									<CardDescription className="text-center">
										Create a new account.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="space-y-1">
										<Label htmlFor="email">Name</Label>
										<Input
											onChange={(e) => setNewName(e.currentTarget.value)}
											id="name"
											placeholder="Your name"
										/>
									</div>

									<div className="space-y-1">
										<Label htmlFor="email">E-mail</Label>
										<Input
											onChange={(e) => setNewEmail(e.currentTarget.value)}
											id="email"
											placeholder="Your email"
										/>
									</div>

									<div className="space-y-1">
										<Label htmlFor="password">Password</Label>
										<Input
											onChange={(e) => setNewPassword(e.currentTarget.value)}
											type="password"
											id="password"
											placeholder="Your password"
										/>
									</div>

									<div className="space-y-1">
										<Label htmlFor="passwordRepeat">Repeat password</Label>
										<Input
											onChange={(e) =>
												setNewPasswordRepeat(e.currentTarget.value)
											}
											type="password"
											id="passwordRepeat"
											placeholder="Re-enter password"
										/>
									</div>
								</CardContent>
								<CardFooter className=" space-x-2">
									<Button variant={"outline"}>Cancel</Button>
									<Button type="submit">Create account</Button>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
