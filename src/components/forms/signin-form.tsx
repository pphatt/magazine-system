"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { login } from "@/lib/actions/login"
import { catchNextAuthError } from "@/lib/utils"
import { authSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/forms/password-input"
import styles from "@/styles/components/forms/signin-form.module.scss"

import { Icons } from "../icons"

export type Inputs = z.infer<typeof authSchema>

export default function SignInForm() {
  const [isPending, startTransition] = React.useTransition()

  // register, handleSubmit, formState
  // default-values for controlled form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: Inputs) => {
    if (isPending) return

    startTransition(async () => {
      try {
        const status = await login(data)

        if (!status) {
          return
        }

        if (status.error) {
          catchNextAuthError(status.error)
        }
      } catch (err) {
        catchNextAuthError(err)
      }
    })
  }

  /*
   * HOF (higher-order functions)
   * (...args) => void form.handleSubmit(onSubmit)(...args) -> actually equivalent to
   * (...args) => void form.handleSubmit(onSubmit(...args)) -> actually equivalent to
   * */
  return (
    <Form {...form}>
      <form
        className={styles["form"]}
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        // onSubmit={void form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ marginLeft: "0px" }}>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="raymondschmidt061@yahoo.com"
                  {...field}
                  className={styles["input"]}
                />
              </FormControl>
              <FormMessage style={{ marginTop: "8px" }} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ marginLeft: "0px" }}>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="**********"
                  {...field}
                  className={styles["input"]}
                />
              </FormControl>
              <FormMessage style={{ marginTop: "8px" }} />
            </FormItem>
          )}
        />
        <Button
          type={"submit"}
          disabled={isPending}
          style={{ height: "2.25rem" }}
        >
          {isPending && (
            <Icons.spinner className={styles["icon"]} aria-hidden="true" />
          )}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
