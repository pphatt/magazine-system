"use client"

import { type User } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { CellAction } from "@/components/tables/user-tables/cell-action"

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (value) => {
      // transform from MARKETING_COORDINATOR to Marketing Coordinator
      return value.row.original.role
        .toLocaleLowerCase()
        .split("_")
        .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
        .join(" ")
    },
  },
  {
    accessorKey: "faculty",
    header: "Faculty",
    cell: (value) => {
      if (!value.row.original.faculty) {
        return value.row.original.faculty
      }

      return value.row.original.faculty
        .toLocaleLowerCase()
        .split("_")
        .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
        .join(" ")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
