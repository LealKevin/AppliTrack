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
import type { IApplication } from "@/pages/ApplicationsPage";

type ApplicationRemoveModalProps = {
	application?: IApplication;
	isModalOpen: boolean;
	handleClose: () => void;
};

function ApplicationRemoveModal({
	isModalOpen,
	handleClose,
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
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ApplicationRemoveModal;
