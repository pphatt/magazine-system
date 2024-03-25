import * as React from "react"
import { db } from "@/server/db"
import moment from "moment"

import { RenderWorkspace } from "@/components/render-workspace"
import styles from "@/styles/(magazine)/page.module.scss"
import {format} from "date-fns";

export default async function MagazinePage({
  params,
}: {
  params: { magazineId: string }
}) {
  const { magazineId } = params

  const magazine = await db.workspace.findFirst({
    where: { id: magazineId },
    include: {
      creator: true,
    },
  })

  if (!magazine || !magazine.content) {
    return <></>
  }

  const content = magazine.content.blocks

  return (
    <div className={styles["magazine-wrapper"]}>
      <p className={styles["magazine-date"]}>
        Posted by <span>{magazine.creator.name}</span>{" "}
        {moment(magazine.createdAt).format("LL")}
      </p>
      <h1 className={styles["magazine-title"]}>{magazine.title}</h1>
      <p className={styles["magazine-deadline"]}>
        Deadline: {format(magazine.deadline, "PPP")}
      </p>
      <RenderWorkspace content={content}/>
    </div>
  )
}
