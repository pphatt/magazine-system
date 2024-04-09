"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type AcademicYear } from "@prisma/client"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AcademicYearAlertModal } from "@/components/modals/academic-year-alert-modal"
import styles from "@/styles/components/tables/academic-year-tables/cell-action.module.scss"

interface CellActionProps {
  data: AcademicYear
}

export const AcademicYearCellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onConfirm = () => {
    startTransition(async () => {
      try {
        const req = await fetch("/api/academic-year/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ academicYearId: data.id }),
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

        toast("Delete academic year successfully")
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  return (
    <>
      <AcademicYearAlertModal
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
            <Link href={`/admin/academic-year/details/${data.id}`}>
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
