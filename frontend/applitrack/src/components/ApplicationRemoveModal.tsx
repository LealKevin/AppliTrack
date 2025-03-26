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
						<p className="text-base font-semibold">
							{application?.TitleApplication}
						</p>
						<p className="text-sm font-normal">From: {application?.Company}</p>
						<p className="text-sm font-normal">
							Apply at: {application?.SentDate}
						</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="justify-between justify-center">
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={submit}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ApplicationRemoveModal;
