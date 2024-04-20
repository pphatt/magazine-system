import * as React from "react"
import { redirect } from "next/navigation"

import { currentUser } from "@/lib/auth/auth"

export default async function RecentBlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user || user.role !== "STUDENT") {
    redirect("/contribution")
  }

  return <>{children}</>
}
