import * as React from "react"

import styles from "@/styles/(auth)/layout.module.scss"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles["layout"]}>
      <main className={styles["main"]}>{children}</main>
    </div>
  )
}
