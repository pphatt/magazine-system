import * as React from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Editor } from "@/components/editor/editor"
import styles from "@/styles/(lobby)/admin/create/page.module.scss"

export default function CreateWorkspacePage() {
  const uuid = uuidv4()

  return (
    <div className={styles["layout"]}>
      <div className={styles["inner-layout"]}>
        {/* heading */}
        <div className={styles["header-wrapper"]}>
          <div className={styles["header-container"]}>
            <h3>Create Workspace</h3>
          </div>
        </div>

        {/* form */}
        <Editor workspaceId={uuid} />

        <div className="w-full flex justify-end">
          <Button type="submit" className="w-full" form="subreddit-post-form">
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
