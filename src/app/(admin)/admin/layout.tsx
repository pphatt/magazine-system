import * as React from "react"
import { redirect } from "next/navigation"

import { currentUser } from "@/lib/auth/auth"
import { AdminMainNav } from "@/components/layouts/admin-main-nav"
import { AdminSiteHeader } from "@/components/layouts/admin-site-header"
import styles from "@/styles/(admin)/layout.module.scss"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await currentUser()

  if (!user || user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className={styles["admin-layout"]}>
      <AdminSiteHeader user={user} />
      <div className={styles["admin-wrapper"]}>
        <AdminMainNav />
        <main className={styles["main"]}>{children}</main>
      </div>
    </div>
  )
}
