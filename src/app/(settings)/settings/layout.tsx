import * as React from "react"
import { User } from "next-auth"

import { userConfig } from "@/config/site"
import { currentUser } from "@/lib/auth/auth"
import { SiteHeader } from "@/components/layouts/site-header"
import styles from "@/styles/(settings)/layout.module.scss"

import { SidebarNav } from "./_components/sidebar-nav"

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = (await currentUser()) as User

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
