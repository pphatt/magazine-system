import * as React from "react"

import styles from "@/styles/(faculty)/layout.module.scss"

interface FacultyLayoutProp {
  children: React.ReactNode
}

export default function FacultyLayout({ children }: FacultyLayoutProp) {
  return (
    <div className={styles["layout-wrapper"]}>
      <div className={styles["layout-container"]}>{children}</div>
    </div>
  )
}
