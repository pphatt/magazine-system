"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { type FacultyWithUser } from "@/lib/prisma"
import { Checkbox } from "@/components/ui/checkbox"
import { CellAction } from "@/components/tables/faculty-tables/cell-action"

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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
