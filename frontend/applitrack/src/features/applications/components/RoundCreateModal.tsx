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
import { useCreateRound } from "../hooks/useRounds";
import type { CreateRoundRequest, RoundType, RoundStatus } from "@/shared/types/api";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/shared/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { format } from "date-fns";

type RoundCreateModalProps = {
	applicationId: string;
	isModalOpen: boolean;
	handleClose: () => void;
	onSuccess?: () => void;
};

const ROUND_TYPES: { value: RoundType; label: string }[] = [
	{ value: "phone_screen", label: "Phone Screen" },
	{ value: "technical", label: "Technical" },
	{ value: "behavioral", label: "Behavioral" },
	{ value: "final", label: "Final" },
	{ value: "onsite", label: "Onsite" },
];

const ROUND_STATUSES: { value: RoundStatus; label: string }[] = [
	{ value: "scheduled", label: "Scheduled" },
	{ value: "completed", label: "Completed" },
	{ value: "passed", label: "Passed" },
	{ value: "failed", label: "Failed" },
];

function RoundCreateModal({
	applicationId,
	isModalOpen,
	handleClose,
	onSuccess,
}: RoundCreateModalProps) {
	const [type, setType] = useState<RoundType>("phone_screen");
	const [status, setStatus] = useState<RoundStatus>("scheduled");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);

	const createRoundMutation = useCreateRound();

	function handleCreateRound(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		const title = formData.get("title") as string;
		const notes = formData.get("notes") as string;
		const interviewer = formData.get("interviewer") as string;
		const duration = formData.get("duration") as string;
		const outcome = formData.get("outcome") as string;
		
		if (!title?.trim() || title.trim().length < 2) {
			setError("Round title is required and must be at least 2 characters");
			return;
		}

		const roundData: CreateRoundRequest = {
			title: title.trim(),
			type,
			status,
			date: date ? date.toISOString() : new Date().toISOString(),
			notes: notes?.trim() || undefined,
			interviewer: interviewer?.trim() || undefined,
			duration: duration?.trim() || undefined,
			outcome: outcome?.trim() || undefined,
			application_id: applicationId,
		};


		createRoundMutation.mutate({
			applicationId,
			roundData
		}, {
			onSuccess: () => {
				onSuccess?.();
				handleClose();
			},
			onError: (error: Error | unknown) => {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				const responseError = error && typeof error === 'object' && 'response' in error 
					? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
					: undefined;
				setError(`Failed to create round: ${responseError || errorMessage}`);
			}
		});
	}

	const handleModalClose = () => {
		setError(null);
		setType("phone_screen");
		setStatus("scheduled");
		setDate(undefined);
		handleClose();
	};

	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleModalClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-[500px] rounded-xl">
				<DialogHeader>
					<DialogTitle className="text-center">Create New Round</DialogTitle>
					{error && (
						<div className="text-sm text-red-600 text-center p-2 bg-red-50 rounded-md border border-red-200">
							{error}
						</div>
					)}
				</DialogHeader>
				<form onSubmit={handleCreateRound}>
					<div className="grid gap-4 py-4">
							<Input 
							name="title" 
							placeholder="Round title (e.g., Technical Interview)" 
							required
						/>

							<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Round Type
							</label>
							<div className="grid grid-cols-3 gap-2">
								{ROUND_TYPES.map((roundType) => (
									<Button
										key={roundType.value}
										type="button"
										className="rounded-xl text-xs"
										variant={type === roundType.value ? "default" : "secondary"}
										onClick={() => setType(roundType.value)}
									>
										{roundType.label}
									</Button>
								))}
							</div>
						</div>

							<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Status
							</label>
							<div className="grid grid-cols-2 gap-2">
								{ROUND_STATUSES.map((roundStatus) => (
									<Button
										key={roundStatus.value}
										type="button"
										className="rounded-xl"
										variant={status === roundStatus.value ? "default" : "secondary"}
										onClick={() => setStatus(roundStatus.value)}
									>
										{roundStatus.label}
									</Button>
								))}
							</div>
						</div>

							<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Date (Optional)
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										className={cn(
											"rounded-xl",
											"input justify-start text-left font-normal w-full",
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
										onSelect={setDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

							<Input 
							name="interviewer" 
							placeholder="Interviewer name (optional)" 
						/>
						
						<Input 
							name="duration" 
							placeholder="Duration (e.g., 1 hour, optional)" 
						/>

						<Input 
							name="outcome" 
							placeholder="Outcome (optional)" 
						/>

							<textarea 
							className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
							placeholder="Notes (optional)" 
							name="notes" 
						/>
					</div>
					<DialogFooter className="justify-between justify-center">
						<Button variant="outline" onClick={handleModalClose}>
							Cancel
						</Button>
						<Button 
							variant="default" 
							type="submit"
							disabled={createRoundMutation.isPending}
						>
							{createRoundMutation.isPending ? "Creating..." : "Create Round"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default RoundCreateModal;