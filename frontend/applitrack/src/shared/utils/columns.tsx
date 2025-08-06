import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	company: z.string(),
	status: z.enum(["pending", "sent", "rejected"]),
	url: z.string(),
	sentDate: z.number(),
});

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		accessorKey: "header",
		header: "Applications",
		cell: ({ row }) => row.original.header,
	},
	{
		accessorKey: "company",
		header: "Company",
		cell: ({ row }) => (
			<Badge variant="outline"> {row.original.company} </Badge>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant="outline" className="flex items-center gap-1">
				{row.original.status === "sent" ? (
					<IconCircleCheckFilled className="size-4 text-green-500" />
				) : (
					<IconLoader className="size-4 animate-spin" />
				)}
				<span>{row.original.status} </span>
			</Badge>
		),
	},
];
