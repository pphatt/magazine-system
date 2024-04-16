import * as React from "react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SetPasswordForm from "@/components/forms/set-password-form"
import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(auth)/(protected-auth)/set-password/page.module.scss"

export default function SetPasswordPage() {
  return (
    <Shell className={styles["sign-in-layout"]}>
      <Card style={{ width: "100%" }}>
        <CardHeader style={{ paddingBottom: "0.5rem" }}>
          <CardTitle style={{ fontSize: "1.5rem", lineHeight: "2rem" }}>
            Set Password
          </CardTitle>
          <CardDescription>Set your preferred password</CardDescription>
        </CardHeader>
        <CardContent className={styles["auth"]}>
          <SetPasswordForm />
        </CardContent>
        <CardFooter className={styles["card-footer"]}>
          <div>
            <span>Already have an account?</span>
            <Link aria-label="Sign in" href={"/sign-in"}>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  )
}
