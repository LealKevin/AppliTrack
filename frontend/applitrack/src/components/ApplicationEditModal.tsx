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
import type { IApplication } from "@/pages/ApplicationsPage";

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
	function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log("edit");
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
				<form onSubmit={handleEditSubmit}>
					<div className="grid gap-2 py-4">
						<Label>
							<span>Company Name</span>
							<Input defaultValue={application?.TitleApplication} />
						</Label>
					</div>
					<DialogFooter className="justify-between justify-center">
						<Button variant="secondary" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export default ApplicationEditModal;
