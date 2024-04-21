import * as React from "react"
import { redirect } from "next/navigation"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = (await currentUser()) as User

  if (
    user.role !== "MARKETING_MANAGER" &&
    user.role !== "MARKETING_COORDINATOR"
  ) {
    redirect("/contribution?page=1&row=10")
  }

  return <>{children}</>
}
