import * as React from "react"
import { redirect } from "next/navigation"
import type { User } from "next-auth"

import { userConfig } from "@/config/site"
import { currentUser } from "@/lib/auth/auth"
import { SiteHeader } from "@/components/layouts/site-header"
import styles from "@/styles/(account)/layout.module.scss"

import { SidebarNav } from "./_components/sidebar-nav"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className={styles["layout"]}>
      <SiteHeader user={user} />
      <main className={styles["main-layout"]}>
        <div className={styles["sidebar-nav"]}>
          <SidebarNav user={user} items={userConfig.sidebarNav} />
        </div>
        <div className={styles["content-layout"]}>{children}</div>
      </main>
    </div>
  )
}
