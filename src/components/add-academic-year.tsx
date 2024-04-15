"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { add } from "date-fns"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import type { z } from "zod"

import { createAcademicYear } from "@/lib/actions/academic-year"
import { addAcademicYearSchema } from "@/lib/validations/academic-year"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CalendarWithTime } from "@/components/calendar-with-time"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/add-academic-year.module.scss"

export type AddAcademicYearInputs = z.infer<typeof addAcademicYearSchema>

const TODAY = new Date()

export function AddAcademicYear() {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddAcademicYearInputs>({
    resolver: zodResolver(addAcademicYearSchema),
    defaultValues: {
      name: "",
      startDate: TODAY,
      closureDate: add(TODAY, { days: 1 }),
      finalClosureDate: add(TODAY, { days: 2 }),
    },
  })

  // start date
  const [startDate, setStartDate] = React.useState<Date>(TODAY)
  const [startDateWithTime, setStartDateWithTime] = React.useState<Date>(TODAY)

  // close date
  const [closureDate, setClosureDate] = React.useState<Date>(
    add(TODAY, { days: 1 })
  )
  const [closureDateWithTime, setClosureDateWithTime] = React.useState<Date>(
    add(TODAY, { days: 1 })
  )

  // final closure date
  const [finalClosureDate, setFinalClosureDate] = React.useState<Date>(
    add(TODAY, { days: 2 })
  )
  const [finalClosureDateWithTime, setFinalClosureDateWithTime] =
    React.useState<Date>(add(TODAY, { days: 2 }))

  function onSubmit(data: AddAcademicYearInputs) {
    startTransition(async () => {
      try {
        const req = await createAcademicYear(data)

        if ("success" in req) {
          setOpen(false)
          router.refresh()

          toast.success("Create new academic year successfully")
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className={styles["add-academic-year-btn"]}>
          <Icons.circlePlus />
          <span>Add Academic Year</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={styles["dialog-content"]}>
        <DialogHeader>
          <DialogTitle>Add new academic year</DialogTitle>
          <DialogDescription>
            Add new academic year here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className={styles["form"]}
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={"Enter name"}
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
                <FormItem className={styles["form"]}>
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
                <FormItem className={styles["form"]}>
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
                <FormItem className={styles["form"]}>
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

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Icons.spinner
                    className={styles["icon"]}
                    aria-hidden="true"
                  />
                )}
                <span>Create</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
