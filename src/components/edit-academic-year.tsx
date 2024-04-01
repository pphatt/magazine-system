"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import type { z } from "zod"

import { type AcademicYearWithUser } from "@/lib/prisma"
import { editAcademicYearSchema } from "@/lib/validations/academic-year"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarWithTime } from "@/components/calendar-with-time"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/edit-academic-year.module.scss"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

export type EditAcademicYearInputs = z.infer<typeof editAcademicYearSchema>

interface EditAcademicYearProps {
  academicYear: AcademicYearWithUser
}

export function EditAcademicYear({ academicYear }: EditAcademicYearProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<EditAcademicYearInputs>({
    resolver: zodResolver(editAcademicYearSchema),
    defaultValues: {
      name: academicYear.name,
      description: academicYear.description,
    },
  })

  // start date
  const [startDate, setStartDate] = React.useState<Date>(academicYear.startDate)
  const [startDateWithTime, setStartDateWithTime] = React.useState<Date>(
    academicYear.startDate
  )

  // close date
  const [closureDate, setClosureDate] = React.useState<Date>(
    academicYear.closureDate
  )
  const [closureDateWithTime, setClosureDateWithTime] = React.useState<Date>(
    academicYear.closureDate
  )

  // final closure date
  const [finalClosureDate, setFinalClosureDate] = React.useState<Date>(
    academicYear.finalClosureDate
  )
  const [finalClosureDateWithTime, setFinalClosureDateWithTime] =
    React.useState<Date>(academicYear.finalClosureDate)

  function onSubmit(data: EditAcademicYearInputs) {
    startTransition(async () => {
      try {
        await fetch("/api/academic-year/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ academicYearId: academicYear.id, ...data }),
        })

        router.refresh()

        toast("Edit academic year successfully")
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  return (
    <div className={styles["edit-academic-year-wrapper"]}>
      <div className={styles["edit-academic-year-container"]}>
        <div className={styles["details-card-wrapper"]}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={styles["form"]}
            >
              <div className={styles["form-container"]}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className={styles["form-item"]}>
                      <FormLabel className={styles["form-label"]}>
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"Enter Faculty's name"}
                          className={styles["form-input"]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className={styles["form-item"]}>
                      <FormLabel className={styles["form-label"]}>
                        Description
                      </FormLabel>
                      <FormControl>
                        <TextareaAutosize
                          placeholder="Enter description"
                          className={styles["form-description"]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field: { onChange } }) => (
                    <FormItem className={styles["form-item"]}>
                      <div className={styles["form-date-input"]}>
                        <FormLabel className={styles["form-label"]}>
                          Start Date
                        </FormLabel>
                        <CalendarWithTime
                          date={startDate}
                          setDate={setStartDate}
                          dateWithTime={startDateWithTime}
                          setDateWithTime={setStartDateWithTime}
                          onChange={onChange}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closureDate"
                  render={({ field: { onChange } }) => (
                    <FormItem className={styles["form-item"]}>
                      <div className={styles["form-date-input"]}>
                        <FormLabel className={styles["form-label"]}>
                          Closure Date
                        </FormLabel>
                        <CalendarWithTime
                          date={closureDate}
                          setDate={setClosureDate}
                          dateWithTime={closureDateWithTime}
                          setDateWithTime={setClosureDateWithTime}
                          onChange={onChange}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finalClosureDate"
                  render={({ field: { onChange } }) => (
                    <FormItem className={styles["form-item"]}>
                      <div className={styles["form-date-input"]}>
                        <FormLabel className={styles["form-label"]}>
                          Final Closure Date
                        </FormLabel>
                        <CalendarWithTime
                          date={finalClosureDate}
                          setDate={setFinalClosureDate}
                          dateWithTime={finalClosureDateWithTime}
                          setDateWithTime={setFinalClosureDateWithTime}
                          onChange={onChange}
                        />
                      </div>
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
                    value={format(academicYear.createdAt, "PPpp")}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
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
            </form>
          </Form>
        </div>
        <div className={styles["user-wrapper"]}>
          <div className={styles["creator-wrapper"]}>
            <div className={styles["text"]}>Created By</div>
            <Button
              type={"button"}
              variant={"outline"}
              className={styles["avatar-trigger"]}
            >
              <Avatar className={styles["avatar"]}>
                <AvatarImage
                  src={academicYear.creator.image as string | undefined}
                  alt={""}
                  style={{
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <AvatarFallback>
                  {academicYear.creator.name?.charAt(0) ?? ""}
                </AvatarFallback>
              </Avatar>
            </Button>
            <div className={styles["creator-name"]}>
              {academicYear.creator.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
