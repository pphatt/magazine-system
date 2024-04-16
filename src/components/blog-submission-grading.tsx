"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { User } from "next-auth"
import { toast } from "sonner"
import type { z } from "zod"

import { gradingBlog } from "@/lib/actions/blog"
import type { blogGradingSchema } from "@/lib/validations/blog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AcceptGradingAlertModal } from "@/components/modals/accept-grading-blog"
import { RejectGradingAlertModal } from "@/components/modals/reject-grading-blog"
import styles from "@/styles/components/blog-submission-grading.module.scss"

interface BlogSubmissionGradingProps {
  user: User
  blogId: string
  status: string
}

export type BlogGradingFormInputs = z.infer<typeof blogGradingSchema>

export function BlogSubmissionGrading({
  user,
  blogId,
  status,
}: BlogSubmissionGradingProps) {
  const [openAccept, setOpenAccept] = React.useState(false)
  const [openReject, setOpenReject] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onAcceptSubmit = () => {
    if (status !== "PENDING") {
      toast.error("Blog post has been graded")
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          blogId,
          status: "APPROVE",
          marketingCoordinatorId: user.id ?? "",
        }

        const req = await gradingBlog(payload)

        if ("success" in req) {
          router.refresh()
          toast.success("Graded successfully.")
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  const onRejectSubmit = () => {
    if (status !== "PENDING") {
      toast.error("Blog post has been graded")
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          blogId,
          status: "REJECT",
          marketingCoordinatorId: user.id ?? "",
        }

        const req = await gradingBlog(payload)

        if ("success" in req) {
          router.refresh()
          toast.success("Graded successfully.")
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  return (
    <div className={styles["article-action-wrapper"]}>
      <AcceptGradingAlertModal
        isOpen={openAccept}
        onClose={() => setOpenAccept(false)}
        onConfirm={onAcceptSubmit}
        loading={isPending}
      />

      <RejectGradingAlertModal
        isOpen={openReject}
        onClose={() => setOpenReject(false)}
        onConfirm={onRejectSubmit}
        loading={isPending}
      />

      <Button
        className={styles["accept-btn"]}
        disabled={isPending}
        onClick={() => setOpenAccept(true)}
      >
        {isPending && (
          <Icons.spinner className={styles["icon"]} aria-hidden="true" />
        )}
        Accept
      </Button>

      <Button
        className={styles["reject-btn"]}
        variant={"destructive"}
        disabled={isPending}
        onClick={() => setOpenReject(true)}
      >
        {isPending && (
          <Icons.spinner className={styles["icon"]} aria-hidden="true" />
        )}
        Reject
      </Button>
    </div>
  )
}
