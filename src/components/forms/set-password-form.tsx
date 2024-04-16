"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { setPassword } from "@/lib/actions/user"
import { setPasswordSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/forms/password-input"
import styles from "@/styles/components/forms/set-password-form.module.scss"

import { Icons } from "../icons"

export type Inputs = z.infer<typeof setPasswordSchema>

export default function SetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const router = useRouter()

  const [isPending, startTransition] = React.useTransition()

  // register, handleSubmit, formState
  // default-values for controlled form
  const form = useForm<Inputs>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: Inputs) => {
    if (isPending) return

    startTransition(async () => {
      try {
        const req = await setPassword(data, token)

        if ("success" in req) {
          toast.success("Set password successfully")
          router.push("/signin")
        } else {
          toast.error(req.error)
        }
      } catch (err) {
        toast.error(JSON.stringify(err))
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className={styles["form"]}
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        // onSubmit={void form.handleSubmit(onSubmit)}
      >
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ marginLeft: "0px" }}>
                Confirm Password
              </FormLabel>
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
          Set Password
        </Button>
      </form>
    </Form>
  )
}
