"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import BulkDeleteModal from "../BulkDeleteModal"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onAddApplication: () => void
  onDeleteSelected?: (ids: string[]) => void
  isDeleting?: boolean
  onImportCSV?: () => void
  onRowDoubleClick?: (data: TData) => void
  highlightedRowId?: string | null
}

export function ApplicationsDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onAddApplication,
  onDeleteSelected,
  isDeleting = false,
  onImportCSV,
  onRowDoubleClick,
  highlightedRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = React.useState(false)
  const [selectedIdsToDelete, setSelectedIdsToDelete] = React.useState<string[]>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const handleDeleteClick = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => (row.original as any).id as string)

    setSelectedIdsToDelete(selectedIds)
    setIsBulkDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!onDeleteSelected || selectedIdsToDelete.length === 0) return

    onDeleteSelected(selectedIdsToDelete)
    setIsBulkDeleteModalOpen(false)
    setSelectedIdsToDelete([])
    setRowSelection({})
  }

  const handleCancelDelete = () => {
    setIsBulkDeleteModalOpen(false)
    setSelectedIdsToDelete([])
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center py-4 mb-4 gap-4">
        <Input
          placeholder="Search applications..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {onDeleteSelected && table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              onClick={handleDeleteClick}
              variant="destructive"
              className="min-h-[44px]"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">
                Delete ({table.getFilteredSelectedRowModel().rows.length})
              </span>
            </Button>
          )}
          {onImportCSV && (
            <Button onClick={onImportCSV} variant={"secondary"} className="min-h-[44px]">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-2">Import CSV</span>
            </Button>
          )}
          <Button onClick={onAddApplication} variant={"default"} className="min-h-[44px]">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline sm:ml-2">Add Application</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className=""
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {
                        column.id === "title_application"
                          ? "Application"
                          : column.id === "sent_date"
                            ? "Date"
                            : column.id
                      }

                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as { className?: string } | undefined;
                  return (
                    <TableHead key={header.id} className={`whitespace-nowrap ${meta?.className || ''}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => {
                    const meta = column.meta as { className?: string } | undefined;
                    return (
                      <TableCell key={colIndex} className={`${meta?.className || ''}`}>
                        <div className="h-4 bg-muted animate-pulse rounded" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isHighlighted = highlightedRowId && (row.original as any)?.id === highlightedRowId;
                return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onDoubleClick={() => onRowDoubleClick?.(row.original)}
                  className={`${onRowDoubleClick ? "cursor-pointer" : ""} ${isHighlighted ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                    return (
                      <TableCell key={cell.id} className={`whitespace-nowrap ${meta?.className || ''}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 py-6">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="min-h-[44px]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="min-h-[44px]"
          >
            Next
          </Button>
        </div>
      </div>

      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedIdsToDelete.length}
        isDeleting={isDeleting}
      />
    </div>
  )
}
