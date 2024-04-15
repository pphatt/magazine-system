import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SignInForm from "@/components/forms/signin-form"
import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(auth)/(protected-auth)/set-password/page.module.scss"

export default function SetPasswordPage() {
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
          <SignInForm />
        </CardContent>
      </Card>
    </Shell>
  )
}
