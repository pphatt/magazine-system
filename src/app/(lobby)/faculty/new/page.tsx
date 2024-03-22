import * as React from "react"

import { currentUser } from "@/lib/auth/auth"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/editor/editor"
import styles from "@/styles/(faculty)/new/page.module.scss"

export default async function NewPage() {
  const user = await currentUser()

  if (!user || !user.faculty || user.role !== "MARKETING_COORDINATOR") {
    return <></>
  }

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles["page-header-wrapper"]}>
        <span className={styles["page-header-text"]}>Create Workspace</span>
      </div>

      <div className={styles["editor-wrapper"]}>
        <Editor faculty={user.faculty} />

        <div className={styles["editor-submit"]}>
          <Button type="submit" form="workspace-post-form">
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
