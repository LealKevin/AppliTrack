import * as React from "react";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import useIsMobile from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReusableTable } from "./table";
import useApplications from "@/hooks/useApplications";
import ApplicationCreateModal from "./ApplicationCreateModal";
import ApplicationRemoveModal from "./ApplicationRemoveModal";
import useDeleteApp from "@/hooks/useDeleteApp";
import type { IApplication } from "@/pages/ApplicationsPage";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import ApplicationEditModal from "./ApplicationEditModal";
import useUpdateApp from "@/hooks/useUpdateApp";
import { Checkbox } from "@/components/ui/checkbox";
import useImportApplications from "@/hooks/useImportApplications";
import type { ImportResult } from "@/utils/apiCalls";
import { ImportModal } from "./ImportModal";

export const schema = z.object({
  id: z.string(),
  header: z.string(),
  company: z.string(),
  status: z.enum(["pending", "sent", "rejected"]),
  url: z.string(),
  sentDate: z.string(),
});


function getColumns({
  setSelectedApplication,
  setIsModalRemoveOpen,
  setIsModalEditOpen,
}: {
  setSelectedApplication: React.Dispatch<
    React.SetStateAction<z.infer<typeof schema> | null>
  >;
  setIsModalRemoveOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<z.infer<typeof schema>>[] {
  return [
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
      accessorKey: "header",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Applications
            {column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconArrowsSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Company
            {column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconArrowsSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.company}
          </Badge>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Status
            {column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconArrowsSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-28">
          <Badge
            variant="outline"
            className="text-muted-foreground px-1.5 flex items-center gap-1"
          >
            {row.original.status === "sent" && (
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
            )}
            {row.original.status === "rejected" && (
              <IconCircleCheckFilled className="fill-red-500 dark:fill-red-400" />
            )}
            {row.original.status !== "sent" &&
              row.original.status !== "rejected" && (
                <IconLoader className="animate-spin" />
              )}
            {row.original.status}
          </Badge>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "sentDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Date
            {column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <IconArrowsSort className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div className="w-24">{formatDateToDDMMYYYY(row.original.sentDate as string)}</div>,
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.sentDate as string);
        const dateB = new Date(rowB.original.sentDate as string);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => {
                setSelectedApplication(row.original);
                setIsModalEditOpen(true);
              }}
              className="text-white focus:text-red-500"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedApplication(row.original);
                setIsModalRemoveOpen(true);
              }}
              className="text-red-500 focus:text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

function parseData(apps: IApplication[]) {
  if (!Array.isArray(apps)) {
    return [];
  }
  const dataParse = apps.map((app) => ({
    id: app.id,
    header: app.title_application,
    company: app.company,
    status: app.status as "pending" | "sent" | "rejected",
    url: app.url_application,
    sentDate: app.sent_date,
  }));

  return dataParse;
}

export function DataTable() {
  const [status, setStatus] = React.useState<
    "sent" | "rejected" | "all" | "pending"
  >("all");
  const [isModalRemoveOpen, setIsModalRemoveOpen] = React.useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState<z.infer<
    typeof schema
  > | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);

  const columns = getColumns({
    setSelectedApplication,
    setIsModalRemoveOpen,
    setIsModalEditOpen,
  });
  const { applications, appsCount } = useApplications(status);
  const deleteApp = useDeleteApp();
  const updateApp = useUpdateApp();
  const importMutation = useImportApplications();

  const dataParsed = parseData(applications);


  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleImport = (file: File) => {
    importMutation.mutate(file, {
      onSuccess: (result: ImportResult) => {
        setImportResult(result);
      },
      onError: (error: unknown) => {
        console.error('Import failed:', error);
        const errorMessage = error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'response' in error
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Unknown error'
            : 'Unknown error';
        alert(`Import failed: ${errorMessage}`);
      }
    });
  };

  const handleBulkDelete = (selectedApps: z.infer<typeof schema>[]) => {
    selectedApps.forEach((app) => {
      deleteApp.mutate(app.id);
    });
  };

  return (
    <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(value as "all" | "sent" | "pending" | "rejected")
          }
        >
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger onClick={() => setStatus("all")} value="all">
            All<Badge variant="secondary">{appsCount?.all_count}</Badge>
          </TabsTrigger>
          <TabsTrigger onClick={() => setStatus("sent")} value="sent">
            Sent <Badge variant="secondary">{appsCount?.sent_count}</Badge>
          </TabsTrigger>
          <TabsTrigger onClick={() => setStatus("pending")} value="pending">
            Pending{" "}
            <Badge variant="secondary">{appsCount?.pending_count}</Badge>
          </TabsTrigger>
          <TabsTrigger onClick={() => setStatus("rejected")} value="rejected">
            Rejected
            <Badge variant="secondary">{appsCount?.rejected_count}</Badge>
          </TabsTrigger>
        </TabsList>

        <ApplicationCreateModal
          handleClose={() => setIsModalCreateOpen(false)}
          isModalOpen={isModalCreateOpen}
        />
        <Button onClick={() => setIsModalCreateOpen(true)}>
          {" "}
          Add new application{" "}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search applications, companies, status..."
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {searchText && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchText("");
                }}
                className="h-8 px-2 lg:px-3"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              {dataParsed.length} application(s)
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-6">
        <ReusableTable
          data={dataParsed}
          columns={columns}
          showColumnCustomization={true}
          showPagination={true}
          enableDragAndDrop={false}
          onImport={handleImportClick}
          isImporting={importMutation.isPending}
          onBulkDelete={handleBulkDelete}
          globalFilter={searchText}
          onGlobalFilterChange={setSearchText}
        />
      </div>
      {isModalRemoveOpen && selectedApplication && (
        <ApplicationRemoveModal
          submit={() => {
            deleteApp.mutate(selectedApplication.id, {
              onSuccess: () => {
                setIsModalRemoveOpen(false);
                setSelectedApplication(null);
              },
            });
          }}
          application={{
            id: selectedApplication.id,
            header: selectedApplication.header,
            company: selectedApplication.company,
            status: selectedApplication.status,
            url: selectedApplication.url,
            sentDate: selectedApplication.sentDate ? new Date(selectedApplication.sentDate).getTime() : Date.now(),
          }}
          handleClose={() => setIsModalRemoveOpen(false)}
          isModalOpen={true}
        />
      )}
      {isModalEditOpen && selectedApplication && (
        <ApplicationEditModal
          onSuccess={() => {
            const appData = {
              id: selectedApplication.id.toString(),
              title_application: selectedApplication.header,
              company: selectedApplication.company,
              sent_date: selectedApplication.sentDate,
              status: selectedApplication.status,
              notes: "",
              url_application: selectedApplication.url,
            };
            updateApp.mutate(appData, {
              onSuccess: () => {
                setIsModalEditOpen(false);
                setSelectedApplication(null);
              },
            });
          }}
          application={{
            id: selectedApplication.id,
            header: selectedApplication.header,
            company: selectedApplication.company,
            status: selectedApplication.status,
            url: selectedApplication.url,
            sentDate: selectedApplication.sentDate ? new Date(selectedApplication.sentDate).getTime() : Date.now(),
          }}
          handleClose={() => setIsModalEditOpen(false)}
          isModalOpen={true}
        />
      )}

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportResult(null);
        }}
        onImport={handleImport}
        isImporting={importMutation.isPending}
        result={importResult}
      />
    </Tabs>
  );
}


function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className=" text-foreground  px-2 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Application Details
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Application Title</Label>
              <Input id="header" defaultValue={item.header} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue={item.company} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Input id="status" defaultValue={item.status} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="url">Application URL</Label>
                <Input id="url" defaultValue={item.url} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="sentDate">Sent Date</Label>
                <Input id="sentDate" defaultValue={formatDateToDDMMYYYY(item.sentDate)} readOnly />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
