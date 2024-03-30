import * as React from "react"
// import { redirect } from "next/navigation"

// import { currentUser } from "@/lib/auth/auth"
import styles from "@/styles/(faculty)/layout.module.scss"

interface FacultyLayoutProp {
  children: React.ReactNode
}

export default function FacultyLayout({ children }: FacultyLayoutProp) {
  // const user = await currentUser()

  // if (!user || !user.faculty) {
  //   redirect("/")
  // }

  return (
    <div className={styles["layout-wrapper"]}>
      <div className={styles["layout-container"]}>{children}</div>
    </div>
  )
}
