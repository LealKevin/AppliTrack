import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import type { schema } from "./ApplicationRemoveModal";
import type { z } from "zod";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/shared/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { format } from "date-fns";

type ApplicationEditModalProps = {
	onSuccess: () => void;
	application?: z.infer<typeof schema>;
	isModalOpen: boolean;
	handleClose: () => void;
};

function ApplicationEditModal({
	onSuccess,
	application,
	isModalOpen,
	handleClose,
}: ApplicationEditModalProps) {
	const [status, setStatus] = useState<
		"pending" | "sent" | "rejected" | undefined
	>(application?.status);
	const [date, setDate] = useState<Date>(application?.sentDate ? new Date(application.sentDate) : new Date());

	function handleEditApplication(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const sentData = formData.get("SentDate");

		console.log({ sentData });
		onSuccess();
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
					<DialogTitle className="text-center">Edit Application</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleEditApplication}>
					<div className="grid gap-2 py-4">
						<span>Title</span>
						<Label>
							<Input
								name="TitleApplication"
								placeholder={application?.header}
							/>
						</Label>
						<span>Company Name</span>
						<Label>
							<Input name="Company" placeholder={application?.company} />
						</Label>
						<span>URL Website</span>
						<Label>
							<Input name="UrlApplication" placeholder={application?.url} />
						</Label>
						<span>Sent Date</span>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										" justify-start text-left font-normal",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="bg-muted w-auto p-0 rounded-sm">
								<Calendar
									mode="single"
									selected={date}
									onSelect={(date) => date && setDate(date)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
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
						<Button variant="secondary" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit">Confirm changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export default ApplicationEditModal;
