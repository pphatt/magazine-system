"use server"

import { isRedirectError } from "next/dist/client/components/redirect"
import { signIn } from "@/server/auth/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/server/routes"
import { type AuthError } from "next-auth"

import { authSchema } from "@/lib/validations/auth"
import { type Inputs } from "@/components/forms/signin-form"

export async function login(values: Inputs) {
  const validatedFields = authSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    if (error instanceof Error) {
      const { type, cause } = error as AuthError

      switch (type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        case "CallbackRouteError":
          return { error: cause?.err?.toString() }
        default:
          return { error: "Something went wrong, please try again later." }
      }
    }

    throw error
  }
}