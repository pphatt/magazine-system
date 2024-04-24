import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import styles from "@/styles/(auth)/layout.module.scss"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles["layout"]}>
      <AspectRatio ratio={16 / 9}>
        <img src="/illustration.jpg" alt="" className={styles["image"]} />
        <div className={styles["image-filter"]} />
        <Link href="/" className={styles["home-icon"]}>
          <img src={"/logo_final-1.jpg"} alt={""} className={styles["logo"]} />
          <span>Magazine University System</span>
        </Link>
      </AspectRatio>
      <main className={styles["auth-layout"]}>{children}</main>
    </div>
  )
}
