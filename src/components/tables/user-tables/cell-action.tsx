"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type User } from "@prisma/client"
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
import { UserAlertModal } from "@/components/modals/user-alert-modal"
import styles from "@/styles/components/tables/user-tables/cell-action.module.scss"

interface CellActionProps {
  data: User
}

export const UserCellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onConfirm = () => {
    startTransition(async () => {
      try {
        const req = await fetch("/api/user/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: data.id }),
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

        toast("Delete user successfully")
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  return (
    <>
      <UserAlertModal
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
            <Link href={`/admin/user/details/${data.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
