"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { z } from "zod"

import type { blogGradingSchema } from "@/lib/validations/blog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AcceptGradingAlertModal } from "@/components/modals/accept-grading-blog"
import { RejectGradingAlertModal } from "@/components/modals/reject-grading-blog"
import styles from "@/styles/components/student-submission-grading.module.scss"

interface StudentSubmissionGradingProps {
  blogId: string
  status: string
}

export type BlogGradingFormInputs = z.infer<typeof blogGradingSchema>

export function StudentSubmissionGrading({
  blogId,
  status,
}: StudentSubmissionGradingProps) {
  const [openAccept, setOpenAccept] = React.useState(false)
  const [openReject, setOpenReject] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onAcceptSubmit = () => {
    if (status !== "PENDING") {
      toast.warning("Blog post has been graded")
      return
    }

    startTransition(async () => {
      try {
        const payload = { blogId, status: "APPROVE" }

        const req = await fetch("/api/blog/grading", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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

        router.refresh()
        toast("Graded successfully.")
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  const onRejectSubmit = () => {
    if (status !== "PENDING") {
      toast.warning("Blog post has been graded")
      return
    }

    startTransition(async () => {
      try {
        const payload = { blogId, status: "REJECT" }

        const req = await fetch("/api/blog/grading", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!req.ok) {
          let errorMessage = "An error occurred"

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

        router.refresh()

        toast("Graded successfully.")
      } catch (e) {
        toast("Something went wrong. Try again!")
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
