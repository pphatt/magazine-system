import * as React from "react"
import { Suspense } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OAuthSignIn } from "@/components/auth/oauth-signin"
import SignInForm from "@/components/forms/signin-form"
import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(auth)/(protected-auth)/signin/page.module.scss"

export default function SignInPage() {
  return (
    <Shell className={styles["sign-in-layout"]}>
      <Card style={{ width: "100%" }}>
        <CardHeader>
          <CardTitle style={{ fontSize: "1.5rem", lineHeight: "2rem" }}>
            Sign in
          </CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className={styles["auth"]}>
          <OAuthSignIn />
          <div className={styles["separator"]}>
            <div className={styles["separator-line"]}>
              <Separator orientation={"horizontal"} />
            </div>
            <div className={styles["separator-text"]}>
              <span>Or continue with</span>
            </div>
          </div>
          <Suspense>
            <SignInForm />
          </Suspense>
        </CardContent>
      </Card>
    </Shell>
  )
}
