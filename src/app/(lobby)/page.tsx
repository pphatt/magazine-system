import * as React from "react"

import { Shell } from "@/components/shells/shell"
import styles from "@/styles/(lobby)/page.module.scss"

export default function Page() {
  return (
    <Shell as={"div"} className={styles["shell"]}></Shell>
  )
}
