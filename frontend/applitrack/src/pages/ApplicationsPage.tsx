import Layout from "./Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusButton from "@/components/StatusButton";
import CreateEditModal from "@/components/CreateEditModal";
import Application from "@/components/Application";
import ApplicationTitle from "@/components/ApplicationTitle";
import ApplicationCompany from "@/components/ApplicationCompany";
import ApplicationIcons from "@/components/ApplicationIcons";
import EditButton from "@/components/EditButton";
import TrashButton from "@/components/TrashButton";
import WebSiteButton from "@/components/WebSiteButton";
import ApplicationEditModal from "@/components/ApplicationEditModal";
import AddButton from "@/components/AddButton";
import ApplicationCreateModal from "@/components/ApplicationCreateModal";
import ApplicationDate from "@/components/ApplicationDate";
import ApplicationRemoveModal from "@/components/ApplicationRemoveModal";

export type IApplication = {
	Company: string;
	CreatedAt: number;
	ID: number;
	Notes: string | null;
	UrlApplication: string;
	SentDate: number;
	Status: "pending" | "sent" | "rejected";
	TitleApplication: string;
	UpdatedAt: number;
	UserID: number;
};

function toCamelCase(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function useApplications({
	status,
}: { status: "all" | "pending" | "sent" | "rejected" }) {
	const [applications, setApplications] = useState<IApplication[]>([]);

	async function fetchApplications() {
		try {
			const response = await axios.get("api/applications");
			setApplications(response.data);
			console.log(response.data);
		} catch (error) {
			console.log("EROOOOOR:", error);
		}
	}

	useEffect(() => {
		fetchApplications();
	}, []);

	return {
		applications: applications.filter((application) => {
			return application.Status === status || status === "all";
		}),
		fetchApplications: fetchApplications,
	};
}

function ApplicationsPage() {
	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
	const [isModalRemoveOpen, setIsModalRemoveOpen] = useState(false);
	const [selectedApplication, setSelectedApplication] = useState<
		IApplication | undefined
	>(undefined);

	const [active, setActive] = useState<"all" | "pending" | "sent" | "rejected">(
		"all",
	);
	const { applications, fetchApplications } = useApplications({
		status: active,
	});

	return (
		<Layout>
			<nav className="flex space-x-4">
				{(["all", "pending", "sent", "rejected"] as const).map((status) => (
					<StatusButton
						key={status}
						isActive={active === status}
						onClick={() => setActive(status)}
					>
						{toCamelCase(status)}
					</StatusButton>
				))}
			</nav>
			<ul className="m-8">
				{/*Add application modal*/}
				<ApplicationCreateModal
					handleClose={() => setIsModalCreateOpen(false)}
					onSuccess={fetchApplications}
					isModalOpen={isModalCreateOpen}
				/>
				<AddButton onClick={() => setIsModalCreateOpen(true)} />

				{/*Edit application modal*/}
				{selectedApplication && (
					<ApplicationEditModal
						application={selectedApplication}
						handleClose={() => setSelectedApplication(undefined)}
						onSuccess={fetchApplications}
						isModalOpen={true}
					/>
				)}

				{/*Remove application modal*/}
				{isModalRemoveOpen && (
					<ApplicationRemoveModal
						application={selectedApplication}
						handleClose={() => setIsModalRemoveOpen(false)}
						isModalOpen={true}
					/>
				)}

				{applications.map((application) => (
					<Application key={application.ID}>
						<ApplicationTitle title={application.TitleApplication} />
						<ApplicationCompany company={application.Company} />
						<ApplicationDate date={application.SentDate} />
						<ApplicationIcons>
							<EditButton onClick={() => setSelectedApplication(application)} />
							<TrashButton onClick={() => setIsModalRemoveOpen(true)} />
							<WebSiteButton url={application.UrlApplication} />
						</ApplicationIcons>
					</Application>
				))}
			</ul>
		</Layout>
	);
}

export default ApplicationsPage;
