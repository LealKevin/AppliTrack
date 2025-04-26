import * as React from "react";
import {
	IconCircleCheckFilled,
	IconDotsVertical,
	IconLoader,
	IconTrendingUp,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReusableTable } from "./table";
import useApplications from "@/hooks/useApplications";
import ApplicationCreateModal from "./ApplicationCreateModal";
import ApplicationRemoveModal from "./ApplicationRemoveModal";
import { useDeleteApp } from "@/hooks/useDeleteApp";
import type { IApplication } from "@/pages/ApplicationsPage";
import ApplicationEditModal from "./ApplicationEditModal";
import { getAppsCount } from "@/utils/apiCalls";

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	company: z.string(),
	status: z.enum(["pending", "sent", "rejected"]),
	url: z.string(),
	sentDate: z.number(),
});

function getColumns({
	setSelectedApplication,
	setIsModalRemoveOpen,
}: {
	setSelectedApplication: React.Dispatch<
		React.SetStateAction<z.infer<typeof schema> | null>
	>;
	setIsModalRemoveOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ColumnDef<z.infer<typeof schema>>[] {
	return [
		{
			accessorKey: "header",
			header: "Applications",
			cell: ({ row }) => {
				return <TableCellViewer item={row.original} />;
			},
			enableHiding: false,
		},
		{
			accessorKey: "company",
			header: () => <div className="w-32">Company</div>,
			cell: ({ row }) => (
				<div className="w-32">
					<Badge variant="outline" className="text-muted-foreground px-1.5">
						{row.original.company}
					</Badge>
				</div>
			),
		},
		{
			accessorKey: "status",
			header: () => <div className="w-28">Status</div>,
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
					</Badge>{" "}
				</div>
			),
		},
		{
			accessorKey: "date",
			header: () => <div className="w-24">Date</div>,
			cell: ({ row }) => <div className="w-24">{row.original.sentDate}</div>,
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
								setIsModalRemoveOpen(true);
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
	const dataParse = apps.map((app) => ({
		id: app.ID,
		header: app.TitleApplication,
		company: app.Company,
		status: app.Status,
		url: app.UrlApplication,
		sentDate: app.SentDate,
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
	const columns = getColumns({ setSelectedApplication, setIsModalRemoveOpen });
	const { applications, appsCount } = useApplications(status);
	const dataParsed = parseData(applications);
	const deleteApp = useDeleteApp();
	console.log("Apps counrt", appsCount?.rejected_count);

	return (
		<Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
			<div className="flex items-center justify-between px-4 lg:px-6">
				<Label htmlFor="view-selector" className="sr-only">
					View
				</Label>
				<Select defaultValue="outline">
					<SelectTrigger
						className="flex w-fit @4xl/main:hidden"
						size="sm"
						id="view-selector"
					>
						<SelectValue placeholder="Select a view" />
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

				<ApplicationEditModal
					handleClose={() => setIsModalEditOpen(false)}
					isModalOpen={isModalEditOpen}
				/>
				<ApplicationCreateModal
					handleClose={() => setIsModalCreateOpen(false)}
					isModalOpen={isModalCreateOpen}
				/>
				<Button onClick={() => setIsModalCreateOpen(true)}>
					{" "}
					Add new application{" "}
				</Button>
			</div>
			<ReusableTable data={dataParsed} columns={columns} />
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
					application={selectedApplication}
					handleClose={() => setIsModalRemoveOpen(false)}
					isModalOpen={true}
				/>
			)}
		</Tabs>
	);
}

const chartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--primary)",
	},
	mobile: {
		label: "Mobile",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

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
						Showing total visitors for the last 6 months
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					{!isMobile && (
						<>
							<ChartContainer config={chartConfig}>
								<AreaChart
									accessibilityLayer
									data={chartData}
									margin={{
										left: 0,
										right: 10,
									}}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value) => value.slice(0, 3)}
										hide
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent indicator="dot" />}
									/>
									<Area
										dataKey="mobile"
										type="natural"
										fill="var(--color-mobile)"
										fillOpacity={0.6}
										stroke="var(--color-mobile)"
										stackId="a"
									/>
									<Area
										dataKey="desktop"
										type="natural"
										fill="var(--color-desktop)"
										fillOpacity={0.4}
										stroke="var(--color-desktop)"
										stackId="a"
									/>
								</AreaChart>
							</ChartContainer>
							<Separator />
							<div className="grid gap-2">
								<div className="flex gap-2 leading-none font-medium">
									Trending up by 5.2% this month{" "}
									<IconTrendingUp className="size-4" />
								</div>
								<div className="text-muted-foreground">
									Showing total visitors for the last 6 months. This is just
									some random text to test the layout. It spans multiple lines
									and should wrap around.
								</div>
							</div>
							<Separator />
						</>
					)}
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="header">Header</Label>
							<Input id="header" defaultValue={item.header} />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="type">Type</Label>
								<Select defaultValue={item.type}>
									<SelectTrigger id="type" className="w-full">
										<SelectValue placeholder="Select a type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Table of Contents">
											Table of Contents
										</SelectItem>
										<SelectItem value="Executive Summary">
											Executive Summary
										</SelectItem>
										<SelectItem value="Technical Approach">
											Technical Approach
										</SelectItem>
										<SelectItem value="Design">Design</SelectItem>
										<SelectItem value="Capabilities">Capabilities</SelectItem>
										<SelectItem value="rejected">Rejected</SelectItem>
										<SelectItem value="Narrative">Narrative</SelectItem>
										<SelectItem value="Cover Page">Cover Page</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="status">Status</Label>
								<Select defaultValue={item.status}>
									<SelectTrigger id="status" className="w-full">
										<SelectValue placeholder="Select a status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Done">Done</SelectItem>
										<SelectItem value="In Progress">In Progress</SelectItem>
										<SelectItem value="Not Started">Not Started</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="target">Target</Label>
								<Input id="target" defaultValue={item.target} />
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="limit">Limit</Label>
								<Input id="limit" defaultValue={item.limit} />
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="reviewer">Reviewer</Label>
							<Select defaultValue={item.reviewer}>
								<SelectTrigger id="reviewer" className="w-full">
									<SelectValue placeholder="Select a reviewer" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
									<SelectItem value="Jamik Tashpulatov">
										Jamik Tashpulatov
									</SelectItem>
									<SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</form>
				</div>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose asChild>
						<Button variant="outline">Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
