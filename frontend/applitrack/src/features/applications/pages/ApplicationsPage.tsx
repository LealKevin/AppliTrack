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
import StatusBadge from "../components/StatusBadge";
import useDeleteApp from "../hooks/useDeleteApp";
import useApplications from "../hooks/useApplications";
import { ApplicationsDataTable } from "../components/data-table/applications-data-table";
import { createColumns } from "../components/data-table/columns";
import ImportModal from "../../import-export/components/ImportModal";
import useImportApplications from "../hooks/useImportApplications";

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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<
    IApplication | undefined
  >(undefined);

  const [active, setActive] = useState<"all" | "pending" | "sent" | "rejected">(
    "all",
  );

  const { applications, refetch: refetchApps, appsCount } = useApplications(active);
  const deleteApp = useDeleteApp();
  const importApps = useImportApplications();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const getStatusCount = (status: "all" | "pending" | "sent" | "rejected") => {
    if (!appsCount) return 0;
    switch (status) {
      case "all": return appsCount.all_count;
      case "pending": return appsCount.pending_count;
      case "sent": return appsCount.sent_count;
      case "rejected": return appsCount.rejected_count;
      default: return 0;
    }
  };

  return (
    <Layout>
      <div className="flex flex-1 flex-col bg-[var(--background)] min-h-screen">
        {/* Modern Header Section */}
        <div className="px-6 py-6 border-b border-[var(--border)] bg-[var(--background)]">
          {/* Top Row: Title + Primary Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Applications</h1>
              <div className="text-sm text-[var(--muted-foreground)]">
                {getStatusCount("all")} applications
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 text-sm rounded-[12px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors flex items-center gap-2"
                title="Customize Columns"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Customize
              </button>

              <button
                className="px-4 py-2 text-sm rounded-[12px] border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors flex items-center gap-2"
                title="Import CSV"
                onClick={() => setIsImportModalOpen(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import CSV
              </button>

              <AddButton onClick={() => setIsModalCreateOpen(true)} />
            </div>
          </div>

          {/* Middle Row: Search + Filter Dropdown */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search applications, companies, locations..."
                className="w-full pl-10 pr-4 py-3 text-sm rounded-[15px] border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
                style={{
                  background: 'var(--app-card-bg)',
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.1)'
                }}
              />
            </div>

            <div className="relative">
              <select
                value={active}
                onChange={(e) => setActive(e.target.value as typeof active)}
                className="appearance-none px-4 py-3 pr-10 text-sm rounded-[15px] border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all cursor-pointer min-w-[120px]"
                style={{
                  background: 'var(--app-card-bg)',
                  boxShadow: 'var(--app-button-shadow)'
                }}
              >
                <option value="all">All ({getStatusCount("all")})</option>
                <option value="pending">Pending ({getStatusCount("pending")})</option>
                <option value="sent">Sent ({getStatusCount("sent")})</option>
                <option value="rejected">Rejected ({getStatusCount("rejected")})</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Bottom Row: Quick Stats + View Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {getStatusCount("sent")} Sent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {getStatusCount("pending")} Pending
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {getStatusCount("rejected")} Rejected
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Grid View</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {applications.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-10 h-10 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  No {active !== "all" ? `${active} ` : ""}applications found
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-relaxed">
                  {active === "all"
                    ? "Start your job search journey by adding your first application."
                    : `You don't have any ${active} applications yet.`
                  }
                </p>
                {active === "all" && <AddButton onClick={() => setIsModalCreateOpen(true)} />}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {applications.map((application) => (
                <Application key={application.id}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={application.status} />
                    <div className="flex gap-1">
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
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3">
                    <ApplicationTitle title={application.title_application} />
                    <ApplicationCompany company={application.company} />
                    <ApplicationDate date={application.sent_date} />
                  </div>
                </Application>
              ))}
            </div>
          )}
        </div>
      </div>

      {/*Add application modal*/}
      <ApplicationCreateModal
        handleClose={() => setIsModalCreateOpen(false)}
        isModalOpen={isModalCreateOpen}
      />

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

      {/*Import CSV modal*/}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(file) => {
          importApps.mutate(file, {
            onSuccess: () => {
              refetchApps();
            }
          });
        }}
        isImporting={importApps.isPending}
        result={importApps.data}
      />
    </Layout>
  );
}

export default ApplicationsPage;
