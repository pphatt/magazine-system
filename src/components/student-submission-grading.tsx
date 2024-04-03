"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { blogGradingSchema } from "@/lib/validations/blog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Icons } from "@/components/icons"
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
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const acceptForm = useForm<BlogGradingFormInputs>({
    resolver: zodResolver(blogGradingSchema),
    defaultValues: {
      blogId: blogId,
    },
  })

  const rejectForm = useForm<BlogGradingFormInputs>({
    resolver: zodResolver(blogGradingSchema),
    defaultValues: {
      blogId: blogId,
    },
  })

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
      <Form {...acceptForm}>
        <form
          onSubmit={(...args) =>
            void acceptForm.handleSubmit(onAcceptSubmit)(...args)
          }
        >
          <Button className={styles["accept-btn"]} disabled={isPending}>
            {isPending && (
              <Icons.spinner className={styles["icon"]} aria-hidden="true" />
            )}
            Accept
          </Button>
        </form>
      </Form>

      <Form {...rejectForm}>
        <form
          onSubmit={(...args) =>
            void rejectForm.handleSubmit(onRejectSubmit)(...args)
          }
        >
          <Button
            className={styles["reject-btn"]}
            variant={"destructive"}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className={styles["icon"]} aria-hidden="true" />
            )}
            Reject
          </Button>
        </form>
      </Form>
    </div>
  )
}
