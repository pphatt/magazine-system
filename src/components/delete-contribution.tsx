"use client"

import * as React from "react"
import { redirect, useRouter } from "next/navigation"
import { toast } from "sonner"
import type { z } from "zod"

import { deleteBlog, gradingBlog } from "@/lib/actions/contribution"
import type { contributionGradingSchema } from "@/lib/validations/contribution"
import { Button } from "@/components/ui/button"
import { DeleteContributionAlertModal } from "@/components/modals/delete-contribution-alert-modal"
import styles from "@/styles/components/delete-contribution.module.scss"

interface StudentSubmissionGradingProps {
  contributionId: string
}

export type BlogGradingFormInputs = z.infer<typeof contributionGradingSchema>

export function DeleteContribution({
  contributionId,
}: StudentSubmissionGradingProps) {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onAcceptSubmit = () => {
    startTransition(async () => {
      try {
        const payload = {
          contributionId,
        }

        const req = await deleteBlog(payload)

        if ("success" in req) {
          toast.success("Delete contribution successfully.")
          setOpen(false)
          redirect("/account/recent-blogs?page=1&row=10")
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  return (
    <div>
      <DeleteContributionAlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onAcceptSubmit}
        loading={isPending}
      />

      <Button
        className={styles["delete-btn"]}
        disabled={isPending}
        onClick={() => setOpen(true)}
        variant={"ghost"}
      >
        Delete
      </Button>
    </div>
  )
}
