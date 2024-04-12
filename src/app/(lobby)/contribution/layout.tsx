import * as React from "react"
import { redirect } from "next/navigation"

import { currentUser } from "@/lib/auth/auth"
import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(contribution)/layout.module.scss"

interface FacultyLayoutProp {
  children: React.ReactNode
}

export default async function FacultyLayout({ children }: FacultyLayoutProp) {
  const user = await currentUser()

  if (!user || !user.role) {
    redirect("/")
  }

  return <Shell className={styles["layout-wrapper"]}>{children}</Shell>
}
