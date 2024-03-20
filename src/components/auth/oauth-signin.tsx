"use client"

import React from "react"
import { DEFAULT_LOGIN_REDIRECT } from "@/server/routes"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/auth/oauth-signin.module.scss"

type OAuthStrategy = "google" | "github"

const authProvider = [
  { name: "Google", strategy: "google", icon: "google" },
] as {
  name: string
  strategy: OAuthStrategy
  icon: keyof typeof Icons
}[]

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null)

  async function oauthSignIn(provider: OAuthStrategy) {
    if (isLoading) return null

    try {
      setIsLoading(provider)

      await signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
      })
    } catch (error) {
      setIsLoading(null)

      // const unknownError = "Something went wrong, please try again."

      toast.error(JSON.stringify(error))
    }
  }

  return (
    <div className={styles["oauth-layout"]}>
      {authProvider.map((provider) => {
        const Icon = Icons[provider.icon]

        return (
          <Button
            style={{ height: "2.25rem" }}
            variant={"outline"}
            key={provider.strategy}
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={isLoading !== null}
          >
            {isLoading === provider.strategy ? (
              <Icons.spinner className={styles["spin"]} aria-hidden="true" />
            ) : (
              <Icon className={styles["icons"]} aria-hidden="true" />
            )}
            {provider.name}
          </Button>
        )
      })}
    </div>
  )
}
