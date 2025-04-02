import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { z } from "zod";

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	company: z.string(),
	status: z.enum(["pending", "sent", "rejected"]),
	url: z.string(),
	sentDate: z.number(),
});

type ApplicationRemoveModalProps = {
	application?: z.infer<typeof schema>;
	isModalOpen: boolean;
	handleClose: () => void;
	submit: () => void;
};

function ApplicationRemoveModal({
	application,
	isModalOpen,
	handleClose,
	submit,
}: ApplicationRemoveModalProps) {
	return (
		<AlertDialog
			open={isModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleClose();
				}
			}}
		>
			<AlertDialogContent className="flex flex-col items-center">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center">
						Are you sure you want to delete this application?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center">
						<p className="text-base font-semibold">{application?.header}</p>
						<p className="text-sm font-normal">From: {application?.company}</p>
						<p className="text-sm font-normal">
							Apply at: {application?.sentDate}
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="justify-between justify-center">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-500 text-white focus:text-red-500"
						onClick={submit}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ApplicationRemoveModal;
