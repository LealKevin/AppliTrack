"use client"

import { useState } from "react"

import { Tabs, TabsContent } from "@/shared/components/ui/tabs"
import { ApplicationsDataTable } from "../components/data-table/applications-data-table"
import { createColumns } from "../components/data-table/columns"
// import { DataTableToolbar } from "../components/data-table/data-table-toolbar"

import useApplications from "@/features/applications/hooks/useApplications"
import useDeleteApp from "@/features/applications/hooks/useDeleteApp"

// Import existing modals
import ApplicationCreateModal from "@/features/applications/components/ApplicationCreateModal"
import ApplicationEditModal from "@/features/applications/components/ApplicationEditModal"
import ApplicationRemoveModal from "@/features/applications/components/ApplicationRemoveModal"
import ImportModal from "@/features/import-export/components/ImportModal"
import useImportApplications from "@/features/applications/hooks/useImportApplications"

import type { IApplication } from "@/shared/types/api"

export default function ApplicationsTablePage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "sent" | "rejected">("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<IApplication | undefined>()

  const { applications, isLoading, refetch } = useApplications(activeTab === "all" ? "" : activeTab)
  const deleteApp = useDeleteApp()
  const importApps = useImportApplications()

  const handleEdit = (application: IApplication) => {
    setSelectedApplication(application)
    setIsEditModalOpen(true)
  }

  const handleDelete = (application: IApplication) => {
    setSelectedApplication(application)
    setIsRemoveModalOpen(true)
  }

  const handleManageRounds = (application: IApplication) => {
    // For now, navigate to the rounds page - later we can make this a modal
    // In a real implementation, this would open a rounds management modal
    // scoped to the specific application
    window.location.href = `/rounds?application=${application.id}&company=${encodeURIComponent(application.company)}`
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onManageRounds: handleManageRounds,
  })

  const handleDeleteConfirm = () => {
    if (selectedApplication) {
      deleteApp.mutate(selectedApplication.id)
      setIsRemoveModalOpen(false)
      setSelectedApplication(undefined)
    }
  }

  const handleDeleteSelected = (ids: string[]) => {
    ids.forEach((id) => {
      deleteApp.mutate(id)
    })
  }

  const handleSuccess = () => {
    refetch()
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsRemoveModalOpen(false)
    setSelectedApplication(undefined)
  }

  return (
    <div className="flex h-full flex-col space-y-8 p-8">

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsContent value={activeTab} className="space-y-4">
          <ApplicationsDataTable
            data={applications}
            columns={columns}
            isLoading={isLoading}
            onAddApplication={() => setIsCreateModalOpen(true)}
            onDeleteSelected={handleDeleteSelected}
            isDeleting={deleteApp.isPending}
            onImportCSV={() => setIsImportModalOpen(true)}
            onRowDoubleClick={handleEdit}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ApplicationCreateModal
        handleClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
        isModalOpen={isCreateModalOpen}
      />

      {isEditModalOpen && selectedApplication && (
        <ApplicationEditModal
          application={selectedApplication}
          handleClose={() => setIsEditModalOpen(false)}
          onSuccess={handleSuccess}
          isModalOpen={true}
        />
      )}

      {isRemoveModalOpen && selectedApplication && (
        <ApplicationRemoveModal
          submit={handleDeleteConfirm}
          application={selectedApplication}
          handleClose={() => setIsRemoveModalOpen(false)}
          isModalOpen={true}
        />
      )}

      {/* Import CSV modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(file) => {
          importApps.mutate(file, {
            onSuccess: () => {
              refetch()
            }
          })
        }}
        isImporting={importApps.isPending}
        result={importApps.data}
      />
    </div>
  )
}
