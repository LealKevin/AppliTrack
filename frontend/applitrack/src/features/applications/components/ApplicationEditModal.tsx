import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import useUpdateApp from "../hooks/useUpdateApp";
import type { IApplication } from "../pages/ApplicationsPage";
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
	application?: IApplication;
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
	const [date, setDate] = useState<Date>(application?.sent_date ? new Date(application.sent_date) : new Date());
	const [error, setError] = useState<string | null>(null);

	const updateApp = useUpdateApp();

	function handleEditApplication(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		if (!application?.id) {
			setError("No application ID found");
			return;
		}

		const title = formData.get("TitleApplication") as string;
		const company = formData.get("Company") as string;
		const location = formData.get("Location") as string;
		
		if (!title?.trim() || title.trim().length < 3) {
			setError("Job title is required and must be at least 3 characters");
			return;
		}
		
		if (!company?.trim() || company.trim().length < 2) {
			setError("Company name is required and must be at least 2 characters");
			return;
		}
		
		if (!location?.trim() || location.trim().length < 2) {
			setError("Location is required and must be at least 2 characters");
			return;
		}
		
		if (!status) {
			setError("Status is required");
			return;
		}

		const updatedApplication: IApplication = {
			id: application.id,
			title_application: title.trim(),
			company: company.trim(),
			location: location.trim(),
			url_application: (formData.get("UrlApplication") as string)?.trim() || "",
			sent_date: formData.get("SentDate") as string,
			status: status as "pending" | "sent" | "rejected",
			notes: (formData.get("Notes") as string)?.trim() || "",
			created_at: application.created_at,
			updated_at: application.updated_at,
		};


		updateApp.mutate(updatedApplication, {
			onSuccess: () => {
				onSuccess();
				handleClose();
			},
			onError: (error: any) => {
				setError(`Failed to update application: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
			}
		});
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
			<DialogContent className="sm:max-w-[425px] rounded-xl">
				<DialogHeader>
					<DialogTitle className="text-center">Edit Application</DialogTitle>
					{error && (
						<div className="text-sm text-red-600 text-center p-2 bg-red-50 rounded-md border border-red-200">
							{error}
						</div>
					)}
				</DialogHeader>
				<form onSubmit={handleEditApplication}>
					<div className="grid gap-2 py-4">
						<input type="hidden" name="SentDate" value={date.toISOString().split('T')[0]} />
						<Input name="TitleApplication" placeholder="Title" defaultValue={application?.title_application} />
						<Input name="Company" placeholder="Company" defaultValue={application?.company} />
						<Input name="Location" placeholder="Location" defaultValue={application?.location} />
						<Input name="UrlApplication" placeholder="Application url" defaultValue={application?.url_application} />
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									className={cn(
										"rounded-xl",
										"input justify-start text-left font-normal",
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
						<div className="flex space-x-2  justify-center">
							<Button
								type="button"
								className={`rounded-xl ${status === "pending" ? "status-pending" : ""}`}
								variant={status === "pending" ? "default" : "secondary"}
								onClick={() => setStatus("pending")}
							>
								Pending
							</Button>
							<Button
								type="button"
								className={`rounded-xl ${status === "sent" ? "status-sent" : ""}`}
								variant={status === "sent" ? "default" : "secondary"}
								onClick={() => setStatus("sent")}
							>
								Sent
							</Button>
							<Button
								type="button"
								className={`rounded-xl ${status === "rejected" ? "status-rejected" : ""}`}
								variant={status === "rejected" ? "default" : "secondary"}
								onClick={() => setStatus("rejected")}
							>
								Rejected
							</Button>
							<input type="hidden" name="Status" value={status} />
						</div>
						<textarea 
							className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
							placeholder="Notes" 
							name="Notes" 
							defaultValue={application?.notes || ''} 
						/>
					</div>
					<DialogFooter className="justify-between justify-center">
						<Button variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button 
							variant="default" 
							type="submit"
							disabled={updateApp.isPending}
						>
							{updateApp.isPending ? "Saving..." : "Save changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export default ApplicationEditModal;
