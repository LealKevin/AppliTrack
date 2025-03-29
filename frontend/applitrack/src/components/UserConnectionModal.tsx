import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";

type UserConnectionModalProps = {
	isModalOpen: boolean;
	handleClose: () => void;
};

export function UserConnectionModal({
	isModalOpen,
	handleClose,
}: UserConnectionModalProps) {
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
				<form>Helo</form>
			</DialogContent>
		</Dialog>
	);
}
