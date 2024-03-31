"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { type UserWithFaculty } from "@/lib/prisma"
import { Checkbox } from "@/components/ui/checkbox"
import { UserCellAction } from "@/components/tables/user-tables/cell-action"

export const columns: ColumnDef<UserWithFaculty>[] = [
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
    accessorKey: "phoneNumber",
    header: "Phone number",
    cell: (value) => {
      if (!value.row.original.phoneNumber) {
        return "-"
      }

      return String(value.row.original.phoneNumber)
    },
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
        return "-"
      }

      return value.row.original.faculty.name
        .toLocaleLowerCase()
        .split("_")
        .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
        .join(" ")
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (value) => {
      return format(value.row.original.createdAt, "PPP")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
]
