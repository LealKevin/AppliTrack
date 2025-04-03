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
import { useState } from "react";
import type { IApplication } from "@/pages/ApplicationsPage";
import useCreateApplication from "@/hooks/useCreateApplication";

type CreateModalProps = {
	isModalOpen: boolean;
	handleClose: () => void;
};

function ApplicationCreateModal({
	handleClose,
	isModalOpen,
}: CreateModalProps) {
	const [status, setStatus] = useState<"pending" | "sent" | "rejected">(
		"pending",
	);

	const createApp = useCreateApplication();
	const handleCreateApplication = async (event: React.FormEvent) => {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const newApplication: IApplication = {
			TitleApplication: formData.get("TitleApplication") as string,
			Company: formData.get("Company") as string,
			UrlApplication: formData.get("UrlApplication") as string,
			SentDate: formData.get("SentDate") as string,
			Status: status,
			Notes: formData.get("Notes") as string,
			UserID: 1,
		};
		await createApp.mutateAsync(newApplication);
		handleClose();
	};

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
				<form onSubmit={handleCreateApplication}>
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
						<Button variant="secondary" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">Create new application</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export default ApplicationCreateModal;
