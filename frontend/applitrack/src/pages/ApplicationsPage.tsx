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
import { useDeleteApp } from "@/hooks/useDeleteApp";
import useApplications from "@/hooks/useApplications";

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

function ApplicationsPage() {
	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
	const [isModalEditOpen, setIsModalEditOpen] = useState(false);
	const [isModalRemoveOpen, setIsModalRemoveOpen] = useState(false);
	const [selectedApplication, setSelectedApplication] = useState<
		IApplication | undefined
	>(undefined);

	const [active, setActive] = useState<"all" | "pending" | "sent" | "rejected">(
		"all",
	);

	const {
		applications,
		isLoading: isLoadingApps,
		error: errorApps,
		refetch: refetchApps,
	} = useApplications();
	const deleteApp = useDeleteApp();

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
					onSuccess={refetchApps}
					isModalOpen={isModalCreateOpen}
				/>
				<AddButton onClick={() => setIsModalCreateOpen(true)} />

				{/*Edit application modal*/}
				{isModalEditOpen && (
					<ApplicationEditModal
						application={selectedApplication}
						handleClose={() => setIsModalEditOpen(false)}
						onSuccess={refetchApps}
						isModalOpen={true}
					/>
				)}

				{/*Remove application modal*/}
				{isModalRemoveOpen && selectedApplication && (
					<ApplicationRemoveModal
						submit={() => {
							console.log("Selected", selectedApplication);
							deleteApp.mutate(selectedApplication.ID);
						}}
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
							<EditButton
								onClick={() => {
									setIsModalEditOpen(true);
									setSelectedApplication(application);
								}}
							/>
							<TrashButton
								onClick={() => {
									setIsModalRemoveOpen(true);
									setSelectedApplication(application);
								}}
							/>
							<WebSiteButton url={application.UrlApplication} />
						</ApplicationIcons>
					</Application>
				))}
			</ul>
		</Layout>
	);
}

export default ApplicationsPage;
