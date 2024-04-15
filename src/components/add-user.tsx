"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Faculty } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { addUserSchema } from "@/lib/validations/user"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/add-user.module.scss"

export type AddUserInputs = z.infer<typeof addUserSchema>

interface AddUserProps {
  faculty: Faculty[]
}

export function AddUser({ faculty }: AddUserProps) {
  const [open, setOpen] = React.useState(false)
  const [selectRole, setSelectRole] = React.useState("")

  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddUserInputs>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "",
      faculty: "",
      address: "",
      city: "",
    },
  })

  function onSubmit(data: AddUserInputs) {
    let payload: AddUserInputs = { ...data }

    if (
      selectRole === "ADMIN" ||
      selectRole === "MARKETING_MANAGER" ||
      selectRole === "GUEST"
    ) {
      payload = {
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        address: data.address,
        phoneNumber: data.phoneNumber,
      }
    }

    startTransition(async () => {
      try {
        const req = await fetch("/api/user/create", {
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

        setOpen(false)
        router.refresh()

        toast.success("Create new user successfully")
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
        <Button variant="outline" className={styles["add-user-btn"]}>
          <Icons.circlePlus />
          <span>Add User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={styles["dialog-content"]}>
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
          <DialogDescription>
            Add new user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className={styles["form"]}
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={"Enter Email"}
                      className={styles["form-input"]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={styles["form-group"]}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter First Name"
                        className={styles["form-input"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Last Name"
                        className={styles["form-input"]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectRole(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user's role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MARKETING_COORDINATOR">
                          Marketing Coordinator
                        </SelectItem>
                        <SelectItem value="MARKETING_MANAGER">
                          Marketing Manager
                        </SelectItem>
                        <SelectItem value="GUEST">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(selectRole === "STUDENT" ||
              selectRole === "MARKETING_COORDINATOR") && (
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem className={styles["form-item"]}>
                    <FormLabel className={styles["form-label"]}>
                      Faculty
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user's faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {faculty.map(({ id, name }, index) => (
                            <SelectItem key={index} value={id}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Address"
                      className={styles["form-input"]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter City"
                      className={styles["form-input"]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter phone number"
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
