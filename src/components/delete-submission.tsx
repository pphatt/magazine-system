"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/server/supabase/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { isBefore } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { fileDeleteSchema } from "@/lib/validations/contributions"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/delete-submission.module.scss"

interface DeleteSubmissionProps {
  contributionsId: string
  locations: string[]
  closureDate: Date
}

export type FileInputs = z.infer<typeof fileDeleteSchema>

export function DeleteSubmission({
  contributionsId,
  locations,
  closureDate,
}: DeleteSubmissionProps) {
  const form = useForm<FileInputs>({
    resolver: zodResolver(fileDeleteSchema),
    defaultValues: {
      contributionsId,
    },
  })

  const router = useRouter()

  const { mutate: deleteContributions, isPending } = useMutation({
    mutationFn: async ({ contributionsId }: FileInputs) => {
      await supabase.storage.from("student-contribution").remove([...locations])

      const payload: FileInputs = {
        contributionsId,
      }

      const response = await fetch("/api/workspace/submit/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await response.json()
    },
    onError: () => {
      toast.warning("Something went wrong.", {
        description: "Your contributions was not submitted. Please try again.",
      })
    },
    onSuccess: () => {
      toast("Delete submission successfully.")
      router.refresh()
    },
  })

  const onSubmit = () => {
    const payload: FileInputs = {
      contributionsId,
    }

    if (isBefore(new Date(), closureDate)) {
      deleteContributions(payload)
    } else {
      toast.error("Delete submission failed. Exceed the closure date")
      router.refresh()
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          className={styles["form"]}
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <Button
            type={"submit"}
            disabled={isPending}
            className={styles["submit-button"]}
          >
            {isPending && (
              <Icons.spinner className={styles["icon"]} aria-hidden="true" />
            )}
            Delete submission
          </Button>
        </form>
      </Form>
    </div>
  )
}
