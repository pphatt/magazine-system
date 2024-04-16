"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { addFaculty } from "@/lib/actions/faculty"
import { addFacultySchema } from "@/lib/validations/faculty"
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
import { Icons } from "@/components/icons"
import styles from "@/styles/components/add-faculty.module.scss"

export type AddFacultyInputs = z.infer<typeof addFacultySchema>

export function AddFaculty() {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddFacultyInputs>({
    resolver: zodResolver(addFacultySchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(data: AddFacultyInputs) {
    const { name } = data

    startTransition(async () => {
      try {
        const req = await addFaculty({ name })

        if ("success" in req) {
          setOpen(false)
          router.refresh()

          toast.success("Create new faculty successfully")
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.success("Something went wrong. Try again!")
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
        <Button variant="outline" className={styles["add-faculty-btn"]}>
          <Icons.circlePlus />
          <span>Add Faculty</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={styles["dialog-content"]}>
        <DialogHeader>
          <DialogTitle>Add new faculty</DialogTitle>
          <DialogDescription>
            Add new faculty here. Click save when you&apos;re done.
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
                      placeholder={"Enter Faculty's name"}
                      className={styles["form-input"]}
                    />
                  </FormControl>
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
