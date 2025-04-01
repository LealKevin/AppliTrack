import {
	ColumnDef,
	getCoreRowModel,
	useReactTable,
	flexRender,
} from "@tanstack/react-table";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Adapted Zod schema from IApplication
export const applicationSchema = z.object({
	ID: z.number(),
	Company: z.string(),
	CreatedAt: z.number(),
	Notes: z.string().nullable(),
	UrlApplication: z.string(),
	SentDate: z.number(),
	Status: z.enum(["pending", "sent", "rejected"]),
	TitleApplication: z.string(),
	UpdatedAt: z.number(),
	UserID: z.number(),
});

const columns: ColumnDef<z.infer<typeof applicationSchema>>[] = [
	{
		accessorKey: "TitleApplication",
		header: "Title",
		cell: ({ row }) => <strong>{row.original.TitleApplication}</strong>,
	},
	{
		accessorKey: "Company",
		header: "Company",
		cell: ({ row }) => row.original.Company,
	},
	{
		accessorKey: "Status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant="outline" className="capitalize">
				{row.original.Status}
			</Badge>
		),
	},
	{
		accessorKey: "SentDate",
		header: "Date",
		cell: ({ row }) => {
			const date = new Date(row.original.SentDate);
			return date.toLocaleDateString();
		},
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => console.log("Edit", row.original)}
			>
				Edit
			</Button>
		),
	},
];

export function ApplicationsDataTable({
	data,
}: {
	data: z.infer<typeof applicationSchema>[];
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<TableHead key={header.id}>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
