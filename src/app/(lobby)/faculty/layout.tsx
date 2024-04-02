import * as React from "react"

import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(faculty)/layout.module.scss"

interface FacultyLayoutProp {
  children: React.ReactNode
}

export default function FacultyLayout({ children }: FacultyLayoutProp) {
  return <Shell className={styles["layout-wrapper"]}>{children}</Shell>
}
