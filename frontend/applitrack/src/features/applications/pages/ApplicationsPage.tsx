import Layout from "@/shared/components/Layout";
import { useState } from "react";
import StatusButton from "../components/StatusButton";
import Application from "../components/Application";
import ApplicationTitle from "../components/ApplicationTitle";
import ApplicationCompany from "../components/ApplicationCompany";
import ApplicationIcons from "../components/ApplicationIcons";
import EditButton from "../components/EditButton";
import TrashButton from "../components/TrashButton";
import WebSiteButton from "../components/WebSiteButton";
import ApplicationEditModal from "../components/ApplicationEditModal";
import AddButton from "../components/AddButton";
import ApplicationCreateModal from "../components/ApplicationCreateModal";
import ApplicationDate from "../components/ApplicationDate";
import ApplicationRemoveModal from "../components/ApplicationRemoveModal";
import useDeleteApp from "../hooks/useDeleteApp";
import useApplications from "../hooks/useApplications";

export type IApplication = {
  company: string;
  location: string;
  created_at: string;
  id: string;
  notes?: string | null;
  url_application: string;
  sent_date: string;
  status: "pending" | "sent" | "rejected";
  title_application: string;
  updated_at: string;
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

  const { applications, refetch: refetchApps } = useApplications(active);
  const deleteApp = useDeleteApp();

  return (
    <Layout>
      <nav className="flex space-x-4">
        {(["all", "pending", "sent", "rejected"] as const).map((status) => (
          <StatusButton
            key={status}
            isActive={active === status}
            onClick={() => {
              setActive(status);
            }}
          >
            {toCamelCase(status)}
          </StatusButton>
        ))}
      </nav>
      <ul className="m-8">
        {/*Add application modal*/}
        <ApplicationCreateModal
          handleClose={() => setIsModalCreateOpen(false)}
          isModalOpen={isModalCreateOpen}
        />
        <AddButton onClick={() => setIsModalCreateOpen(true)} />

        {/*Edit application modal*/}
        {isModalEditOpen && selectedApplication && (
          <ApplicationEditModal
            application={{
              id: selectedApplication.id,
              title_application: selectedApplication.title_application,
              company: selectedApplication.company,
              status: selectedApplication.status,
              url_application: selectedApplication.url_application,
              sent_date: selectedApplication.sent_date,
              created_at: selectedApplication.created_at,
              updated_at: selectedApplication.updated_at,
              location: selectedApplication.location,
              notes: selectedApplication.notes,
            }}
            handleClose={() => setIsModalEditOpen(false)}
            onSuccess={refetchApps}
            isModalOpen={true}
          />
        )}

        {/*Remove application modal*/}
        {isModalRemoveOpen && selectedApplication && (
          <ApplicationRemoveModal
            submit={() => {
              deleteApp.mutate(selectedApplication.id);
            }}
            application={{
              id: selectedApplication.id,
              title_application: selectedApplication.title_application,
              company: selectedApplication.company,
              status: selectedApplication.status,
              url_application: selectedApplication.url_application,
              sent_date: selectedApplication.sent_date,
              created_at: selectedApplication.created_at,
              updated_at: selectedApplication.updated_at,
              location: selectedApplication.location,
              notes: selectedApplication.notes,
            }}
            handleClose={() => setIsModalRemoveOpen(false)}
            isModalOpen={true}
          />
        )}

        {applications.map((application) => (
          <Application key={application.id}>
            <ApplicationTitle title={application.title_application} />
            <ApplicationCompany company={application.company} />
            <ApplicationDate date={application.sent_date} />
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
              <WebSiteButton url={application.url_application} />
            </ApplicationIcons>
          </Application>
        ))}
      </ul>
    </Layout>
  );
}

export default ApplicationsPage;
