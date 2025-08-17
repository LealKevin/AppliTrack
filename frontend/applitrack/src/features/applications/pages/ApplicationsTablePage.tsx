"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate as useRouterNavigate } from "react-router-dom"

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
import ReminderModal from "@/features/applications/components/ReminderModal"
import ImportModal from "@/features/import-export/components/ImportModal"
import useImportApplications from "@/features/applications/hooks/useImportApplications"
import useReminders from "@/features/applications/hooks/useReminders"
import useReminderNotifications from "@/features/applications/hooks/useReminderNotifications"

import type { IApplication } from "@/shared/types/api"

export default function ApplicationsTablePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const routerNavigate = useRouterNavigate();
  const highlightAppId = searchParams.get('highlight');
  const createParam = searchParams.get('create');
  const [highlightedAppId, setHighlightedAppId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "sent" | "rejected">("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<IApplication | undefined>()
  const [selectedReminder, setSelectedReminder] = useState<{
    id: string;
    date: string;
  } | undefined>(undefined)

  const { applications, isLoading, refetch } = useApplications(activeTab === "all" ? "" : activeTab)
  const { reminders } = useReminders()
  useReminderNotifications() // Initialize notification system
  const deleteApp = useDeleteApp()
  const importApps = useImportApplications()
  
  // Handle highlighting from URL parameter
  useEffect(() => {
    if (highlightAppId && applications.length > 0) {
      setHighlightedAppId(highlightAppId);
      
      // Find the application and switch to the appropriate tab
      const targetApp = applications.find(app => app.id === highlightAppId);
      if (targetApp && targetApp.status !== activeTab) {
        if (targetApp.status === 'pending' || targetApp.status === 'sent' || targetApp.status === 'rejected') {
          setActiveTab(targetApp.status);
        } else {
          setActiveTab('all');
        }
      }
      
      // Clear URL parameter after processing to avoid interference
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('highlight');
      setSearchParams(newParams, { replace: true });
    }
  }, [highlightAppId, applications, activeTab, searchParams, setSearchParams]);

  // Handle create modal from URL parameter
  useEffect(() => {
    if (createParam === 'true') {
      setIsCreateModalOpen(true);
      
      // Clear URL parameter after opening modal
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('create');
      setSearchParams(newParams, { replace: true });
    }
  }, [createParam, searchParams, setSearchParams]);
  
  // Clear highlighting after a timeout and on any interaction
  useEffect(() => {
    if (highlightedAppId) {
      const timer = setTimeout(() => {
        setHighlightedAppId(null);
      }, 8000); // Clear after 8 seconds
      
      return () => clearTimeout(timer);
    }
  }, [highlightedAppId]);
  
  // Add click handler to clear highlighting
  const handlePageClick = (e: React.MouseEvent) => {
    if (highlightedAppId) {
      setHighlightedAppId(null);
    }
  };

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

  // Check if application has an active reminder
  const getApplicationReminder = (applicationId: string) => {
    return reminders?.find(reminder => 
      reminder.application_id === applicationId && reminder.status === 'pending'
    );
  }

  const handleSetReminder = (application: IApplication) => {
    const existingReminder = getApplicationReminder(application.id)
    
    setSelectedApplication(application)
    if (existingReminder) {
      setSelectedReminder({
        id: existingReminder.id,
        date: existingReminder.reminder_date
      })
    } else {
      setSelectedReminder(undefined)
    }
    setIsReminderModalOpen(true)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onManageRounds: handleManageRounds,
    onSetReminder: handleSetReminder,
    getApplicationReminder: getApplicationReminder,
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
    setIsReminderModalOpen(false)
    setSelectedApplication(undefined)
    setSelectedReminder(undefined)
  }

  return (
    <div className="flex h-full flex-col space-y-8 p-8" onClick={handlePageClick}>

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
            highlightedRowId={highlightedAppId}
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

      {/* Reminder modal */}
      {isReminderModalOpen && selectedApplication && (
        <ReminderModal
          isModalOpen={isReminderModalOpen}
          handleClose={() => {
            setIsReminderModalOpen(false)
            setSelectedApplication(undefined)
            setSelectedReminder(undefined)
          }}
          application={selectedApplication}
          existingReminderId={selectedReminder?.id}
          existingReminderDate={selectedReminder?.date}
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
