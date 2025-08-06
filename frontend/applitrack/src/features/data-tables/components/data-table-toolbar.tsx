import { IconTrash, IconFileImport, IconLoader } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/shared/components/ui/button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onImport?: () => void;
  onBulkDelete?: (selectedRows: TData[]) => void;
  isImporting?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  onImport,
  onBulkDelete,
  isImporting = false,
}: DataTableToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
            {onBulkDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkDelete(selectedRows.map(row => row.original))}
                className="h-8"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {onImport && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={isImporting}
            onClick={onImport}
          >
            {isImporting ? (
              <IconLoader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IconFileImport className="mr-2 h-4 w-4" />
            )}
            {isImporting ? 'Importing...' : 'Import CSV'}
          </Button>
        )}
      </div>
    </div>
  );
}