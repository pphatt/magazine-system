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

import { fileEditSchema } from "@/lib/validations/contributions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/edit-submission.module.scss"

interface EditSubmissionProps {
  contributionsId: string
  magazineId: string
  closureDate: Date
  userId: string
  locations: string[]
}

export type FileInputs = z.infer<typeof fileEditSchema>

export function EditSubmission({
  contributionsId,
  userId,
  magazineId,
  closureDate,
  locations,
}: EditSubmissionProps) {
  const form = useForm<FileInputs>({
    resolver: zodResolver(fileEditSchema),
    defaultValues: {
      userId,
      contributionsId,
      workspaceId: magazineId,
    },
  })

  const [showEdit, setShowEdit] = React.useState(false)
  const router = useRouter()

  const { mutate: editContributions, isPending } = useMutation({
    mutationFn: async ({
      contributionsId,
      workspaceId,
      userId,
      files,
    }: FileInputs) => {
      await supabase.storage.from("student-contribution").remove([...locations])

      const location: string[] = []

      for (const file of files! as FileList) {
        const { data } = await supabase.storage
          .from("student-contribution")
          .upload(`${workspaceId}/${userId}/${file.name}`, file)

        if (data?.path) {
          location.push(data?.path)
        }
      }

      const payload: FileInputs = {
        contributionsId,
        userId,
        workspaceId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        files,
        location,
      }

      const response = await fetch("/api/workspace/submit/edit", {
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
      toast("Edit submit successfully.")
      router.refresh()
      setShowEdit(false)
    },
  })

  const onSubmit = (files: FileInputs) => {
    if (!files) {
      toast.error("There is no files to submit")
      return
    }

    const payload: FileInputs = {
      contributionsId,
      workspaceId: magazineId,
      userId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      files: files.files,
    }

    if (isBefore(new Date(), closureDate)) {
      editContributions(payload)
    } else {
      toast.error("Edit submission failed. Exceed the closure date")
      router.refresh()
    }
  }

  return (
    <div>
      <Button onClick={() => setShowEdit(!showEdit)}>Edit submission</Button>

      {showEdit && (
        <div>
          <Form {...form}>
            <form
              className={styles["form"]}
              onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
              <FormField
                control={form.control}
                name="files"
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        multiple
                        accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(event) => {
                          onChange(event.target.files)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type={"submit"}
                disabled={isPending}
                className={styles["submit-button"]}
              >
                {isPending && (
                  <Icons.spinner
                    className={styles["icon"]}
                    aria-hidden="true"
                  />
                )}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
