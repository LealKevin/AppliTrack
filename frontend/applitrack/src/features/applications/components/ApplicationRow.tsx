import CreateEditModal from "./CreateEditModal";
import { Button } from "@/shared/components/ui/button";

const iconWebsite = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-6"
	>
		<path
			fillRule="evenodd"
			d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
			clipRule="evenodd"
		/>
	</svg>
);

import type { IApplication } from "@/shared/types/api";

type ApplicationRowProps = {
	application: IApplication;
};

function ApplicationRow({ application }: ApplicationRowProps) {
	return (
		<Button
			variant="ghost"
			className="w-full flex border-b border-gray-200 m-2 p-4"
		>
			<CreateEditModal type="edit" application={application} onSuccess={() => window.location.reload()} />
			<Button variant="outline" className="m-2 w-8 h-8">
				{iconWebsite}
			</Button>
		</Button>
	);
}

export default ApplicationRow;
