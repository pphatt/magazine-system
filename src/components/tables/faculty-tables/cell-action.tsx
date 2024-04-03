"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type Faculty } from "@prisma/client"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"
import type { z } from "zod"

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
        const req = await fetch("/api/faculty/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ facultyId: data.id }),
        })

        if (!req.ok) {
          let errorMessage = "Some went wrong try again later."

          try {
            const responseText = await req.text()

            errorMessage = responseText || errorMessage
          } catch (error) {
            toast.warning("Error parsing response text", {
              description: String(error),
            })
          }

          toast.warning(errorMessage)
          return
        }

        setOpen(false)
        router.refresh()

        toast("Delete faculty successfully")
      } catch (e) {
        toast("Something went wrong. Try again!")
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
          <DropdownMenuItem
            onClick={() => router.push(`/admin/faculty/details/${data.id}`)}
          >
            <Edit />
            <span>Edit</span>
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
