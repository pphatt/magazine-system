"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { type AcademicYearWithUser } from "@/lib/prisma"
import { Checkbox } from "@/components/ui/checkbox"
import { AcademicYearCellAction } from "@/components/tables/academic-year-tables/cell-action"
import { StatusColumn } from "@/components/tables/status"

export const columns: ColumnDef<AcademicYearWithUser>[] = [
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
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      return format(row.original.startDate, "PPpp")
    },
  },
  {
    accessorKey: "closureDate",
    header: "Closure Date",
    cell: ({ row }) => {
      return format(row.original.closureDate, "PPpp")
    },
  },
  {
    accessorKey: "finalClosureDate",
    header: "Final Closure Date",
    cell: ({ row }) => {
      return format(row.original.finalClosureDate, "PPpp")
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusColumn status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <AcademicYearCellAction data={row.original} />,
  },
]
