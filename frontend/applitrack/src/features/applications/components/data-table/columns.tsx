"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Calendar, Bell } from "lucide-react"
import EnhancedReminderIndicator from "../../../reminders/components/EnhancedReminderIndicator"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Badge } from "@/shared/components/ui/badge"
import StatusBadge from "@/features/applications/components/StatusBadge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import type { IApplication } from "@/shared/types/api"

interface ColumnActions {
  onEdit: (application: IApplication) => void
  onDelete: (application: IApplication) => void
  onManageRounds?: (application: IApplication) => void
  onSetReminder?: (application: IApplication) => void
  getApplicationReminder?: (applicationId: string) => any
}

export const createColumns = ({ onEdit, onDelete, onManageRounds, onSetReminder, getApplicationReminder }: ColumnActions): ColumnDef<IApplication>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "reminder",
    header: () => (
      <div className="flex justify-center" title="Reminders">
        <Bell className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const application = row.original
      const reminder = getApplicationReminder ? getApplicationReminder(application.id) : null
      
      return (
        <EnhancedReminderIndicator 
          reminder={reminder}
          onClick={() => onSetReminder && onSetReminder(application)}
        />
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "title_application",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const title = row.getValue("title_application") as string
      return <div className="font-medium">{title}</div>
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium w-full"
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const company = row.getValue("company") as string
      return (
        <Badge variant="secondary" className="font-normal w-full text-center">
          {company}
        </Badge>
      )
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      return <div className="text-muted-foreground">{location}</div>
    },
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as "pending" | "sent" | "interview_scheduled" | "interviewing" | "rejected" | "offer"
      
      return (
        <div className="flex justify-center">
          <StatusBadge status={status} />
        </div>
      )
    },
  },
  {
    id: "current_round",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Current Round
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const application = row.original
      
      if (application.status === "interview_scheduled") {
        return (
          <div className="flex flex-col space-y-1">
            <div className="text-xs font-medium">Interview Process</div>
            <Badge 
              variant="outline" 
              className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-none text-xs w-fit"
            >
              Scheduled
            </Badge>
          </div>
        )
      } else if (application.status === "interviewing") {
        return (
          <div className="flex flex-col space-y-1">
            <div className="text-xs font-medium">Interview Process</div>
            <Badge 
              variant="outline" 
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-none text-xs w-fit"
            >
              In Progress
            </Badge>
          </div>
        )
      } else {
        return (
          <div className="text-xs text-muted-foreground">
            No active interviews
          </div>
        )
      }
    },
    meta: {
      className: "hidden lg:table-cell",
    },
  },
  {
    accessorKey: "sent_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("sent_date") as string
      const formatted = new Date(date).toLocaleDateString()
      return <div className="text-muted-foreground">{formatted}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const application = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 p-0 touch-none" style={{ minHeight: '44px', minWidth: '44px' }}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                if (application.url_application) {
                  window.open(application.url_application, '_blank')
                }
              }}
            >
              View application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(application)}>
              Edit application
            </DropdownMenuItem>
            {onSetReminder && (
              <DropdownMenuItem onClick={() => onSetReminder(application)}>
                {(() => {
                  const reminder = getApplicationReminder ? getApplicationReminder(application.id) : null
                  if (!reminder) return "Set reminder"
                  if (reminder.status === 'pending') return "Edit reminder"
                  if (reminder.status === 'completed') return "View reminder"
                  return "Set reminder"
                })()}
              </DropdownMenuItem>
            )}
            {onManageRounds && (application.status === "interview_scheduled" || application.status === "interviewing") && (
              <DropdownMenuItem onClick={() => onManageRounds(application)}>
                Manage rounds
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(application)}
              className="text-destructive"
            >
              Delete application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
