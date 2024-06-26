"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { type FacultyWithUser } from "@/lib/prisma"
import { Checkbox } from "@/components/ui/checkbox"
import { FacultyCellAction } from "@/components/tables/faculty-tables/cell-action"
import { StatusColumn } from "@/components/tables/status"

export const columns: ColumnDef<FacultyWithUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "creator",
    header: "Created By",
    cell: (value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.row.original.creator.name
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (value) => {
      return format(value.row.original.createdAt, "PPpp")
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusColumn status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <FacultyCellAction data={row.original} />,
  },
]
