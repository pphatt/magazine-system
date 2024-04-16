"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Faculty } from "@prisma/client"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"
import type { z } from "zod"

import { deleteFaculty } from "@/lib/actions/faculty"
import { type deleteFacultySchema } from "@/lib/validations/faculty"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FacultyAlertModal } from "@/components/modals/faculty-alert-modal"
import styles from "@/styles/components/tables/faculty-tables/cell-action.module.scss"

interface CellActionProps {
  data: Faculty
}

export type DeleteFacultyInputs = z.infer<typeof deleteFacultySchema>

export const FacultyCellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onConfirm = () => {
    startTransition(async () => {
      try {
        const req = await deleteFaculty({ facultyId: data.id })

        if ("success" in req) {
          setOpen(false)
          router.refresh()

          toast.success("Delete faculty successfully")
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.success("Something went wrong. Try again!")
      }
    })
  }

  return (
    <>
      <FacultyAlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={styles["action-btn"]}>
            <span className={styles["text"]}>Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/faculty/details/${data.id}`}>
              <Edit />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
