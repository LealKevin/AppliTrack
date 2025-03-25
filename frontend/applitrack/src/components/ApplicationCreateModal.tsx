import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import type { IApplication } from "@/pages/ApplicationsPage";

type CreateModalProps = {
	isModalOpen: boolean;
	onSuccess: () => void;
	application?: IApplication;
	handleClose: () => void;
};

function ApplicationCreateModal({
	handleClose,
	isModalOpen,
	onSuccess,
}: CreateModalProps) {
	const [status, setStatus] = useState<"pending" | "sent" | "rejected">(
		"pending",
	);

	async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries());

		try {
			const response = await axios.post("api/application", {
				...data,
				UserID: 1,
			});
			console.log(response.data);
		} catch (error) {
			console.log("EROOOOOR:", error);
		}
		onSuccess();
		handleClose();
	}

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-center">Create Application</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleCreateSubmit}>
					<div className="grid gap-2 py-4">
						<span>Title</span>
						<Label>
							<Input name="TitleApplication" />
						</Label>
						<span>Company Name</span>
						<Label>
							<Input name="Company" />
						</Label>
						<span>URL Website</span>
						<Label>
							<Input name="UrlApplication" />
						</Label>
						<span>Sent Date</span>
						<Label>
							<Input className="center" name="SentDate" type="date" />
						</Label>
						<hr className="m-4" />
						<span className="justify-center text-center">Status</span>
						<div className="flex space-x-2  justify-center">
							<Button
								type="button"
								variant={status === "pending" ? "default" : "secondary"}
								onClick={() => setStatus("pending")}
							>
								Pending
							</Button>
							<Button
								type="button"
								variant={status === "sent" ? "default" : "secondary"}
								onClick={() => setStatus("sent")}
							>
								Sent
							</Button>
							<Button
								type="button"
								variant={status === "rejected" ? "default" : "secondary"}
								onClick={() => setStatus("rejected")}
							>
								Rejected
							</Button>
							<input type="hidden" name="Status" value={status} />
						</div>
						<hr className="m-4" />
						<span>Notes</span>
						<Label>
							<Input type="text" name="Notes" />
						</Label>
					</div>
					<DialogFooter className="justify-between justify-center">
						<Button variant="secondary">Cancel</Button>
						<Button type="submit">Create new application</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export default ApplicationCreateModal;
