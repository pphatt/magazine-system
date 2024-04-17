import * as React from "react"
import {currentUser} from "@/lib/auth/auth";
import {redirect} from "next/navigation";

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
