"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { type FacultyWithUser } from "@/lib/prisma"
import { editFacultySchema } from "@/lib/validations/faculty"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/edit-faculty.module.scss"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

export type EditFacultyInputs = z.infer<typeof editFacultySchema>

interface EditFacultyProps {
  faculty: FacultyWithUser
}

export function EditFaculty({ faculty }: EditFacultyProps) {
  const [input, setInput] = React.useState(faculty.name)
  const [selectStatus, setSelectStatus] = React.useState(
    faculty.status as string
  )

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<EditFacultyInputs>({
    resolver: zodResolver(editFacultySchema),
    defaultValues: {
      name: faculty.name,
      status: faculty.status as string,
    },
  })

  function onSubmit(data: EditFacultyInputs) {
    const { name, status } = data

    startTransition(async () => {
      try {
        const req = await fetch("/api/faculty/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ facultyId: faculty.id, name, status }),
        })

        if (!req.ok) {
          let errorMessage = "Some went wrong try again later."

          try {
            const responseText = await req.text()

            errorMessage = responseText || errorMessage
          } catch (error) {
            toast.error("Error parsing response text", {
              description: String(error),
            })
          }

          toast.error(errorMessage)
          return
        }

        router.refresh()

        toast.success("Edit faculty successfully")
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles["form"]}>
          <div className={styles["wrapper"]}>
            <div className={styles["form-container"]}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"Enter Faculty's name"}
                        className={styles["form-input"]}
                        value={input}
                        onChange={(event) => {
                          setInput(event.target.value)
                          field.onChange(event.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>
                      Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectStatus(value)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty's status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={styles["disabled-input-container"]}>
                <label className={styles["disabled-input-label"]}>
                  Created At
                </label>
                <Input
                  disabled={true}
                  className={styles["disabled-input"]}
                  value={format(faculty.createdAt, "PPpp")}
                />
              </div>

              <Button
                type="submit"
                disabled={
                  isPending ||
                  (faculty.name === input && faculty.status === selectStatus)
                }
                className={styles["submit-btn"]}
              >
                {isPending && (
                  <Icons.spinner
                    className={styles["icon"]}
                    aria-hidden="true"
                  />
                )}
                <span>Save changes</span>
              </Button>
            </div>

            <div className={styles["creator-wrapper"]}>
              <div className={styles["text"]}>Created By</div>
              <Button
                type={"button"}
                variant={"outline"}
                className={styles["avatar-trigger"]}
              >
                <Avatar className={styles["avatar"]}>
                  <AvatarImage
                    src={faculty.creator.image as string | undefined}
                    alt={""}
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                  />
                  <AvatarFallback>
                    {faculty.creator.name?.charAt(0) ?? ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <div className={styles["creator-name"]}>
                {faculty.creator.name}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
