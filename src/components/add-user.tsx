"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { addUserSchema } from "@/lib/validations/add-user"
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

type AddUserInputs = z.infer<typeof addUserSchema>

export function AddUser() {
  const [open, setOpen] = React.useState(false)
  const [selectRole, setSelectRole] = React.useState("")

  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddUserInputs>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "",
      faculty: "",
      address: "",
      city: "",
    },
  })

  function onSubmit(data: AddUserInputs) {
    let validate_data: AddUserInputs = data

    if (
      selectRole === "admin" ||
      selectRole === "marketing manager" ||
      selectRole === "guest"
    ) {
      validate_data = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        address: data.address,
      }
    }
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
            id="add-user-form"
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
                      className={styles["form-input"]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className={styles["form-item"]}>
                  <FormLabel className={styles["form-label"]}>
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
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
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="marketing coordinator">
                          Marketing Coordinator
                        </SelectItem>
                        <SelectItem value="marketing manager">
                          Marketing Manager
                        </SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(selectRole === "student" ||
              selectRole === "marketing coordinator") && (
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
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="graphic design">
                            Graphic Design
                          </SelectItem>
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
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" form={"add-user-form"}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
