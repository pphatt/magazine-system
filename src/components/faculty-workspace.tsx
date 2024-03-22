import * as React from "react"
import { db } from "@/server/db"

import { FacultyWorkspaceEmpty } from "@/components/faculty-workspace-empty"
import styles from "@/styles/components/faculty-workspace.module.scss"

export async function FacultyWorkspace() {
  const workspace = await db.workspace.findMany({
    where: { faculty: "INFOMATION_TECNOLOGY" },
  })

  if (!workspace.length) {
    return <FacultyWorkspaceEmpty />
  }

  return (
    <div className={styles["workspace-wrapper"]}>
      <div className={styles["workspace-container"]}></div>
    </div>
  )
}
