import ApplicationIcons from "./ApplicationIcons";
import CreateEditModal from "./CreateEditModal";
import { Button } from "./ui/button";

type ApplicationRowProps = {
	application: {
		Company: string;
		CreatedAt: number;
		ID: number;
		Notes: string | null;
		URLApplication: string;
		SentDate: number;
		Status: "pending" | "sent" | "rejected";
		TitleApplication: string;
		UpdatedAt: number;
		UserID: number;
	};
};

function ApplicationRow({ application }: ApplicationRowProps) {
	return (
		<Button
			variant="ghost"
			className="w-full flex border-b border-gray-200 m-2 p-4"
		>
			<CreateEditModal type="edit" application={application} />
			<Button variant="outline" className="m-2 w-8 h-8">
				{iconWebsite}
			</Button>
		</Button>
	);
}

export default ApplicationRow;
