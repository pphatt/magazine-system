import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/server/db"
import type { User } from "next-auth"

import { FacultyWorkspaceEmpty } from "@/components/faculty-workspace-empty"
import styles from "@/styles/components/faculty-workspace.module.scss"

interface FacultyWorkspaceProps {
  user: User
}

export async function FacultyWorkspace({ user }: FacultyWorkspaceProps) {
  if (!user) {
    redirect("/")
  }

  const workspace = await db.workspace.findMany({
    where: { faculty: user.faculty },
  })

  if (!workspace.length) {
    return <FacultyWorkspaceEmpty />
  }

  return (
    <ul className={styles["workspace-wrapper"]}>
      {workspace.map(({ id, name, createdAt }, index) => (
        <li key={index} className={styles["item-wrapper"]}>
          <Link href={`/faculty/magazine/${id}`} className={styles["item-container"]}>
            <div className={styles["item-title"]}>{name}</div>
            <div className={styles["item-datetime"]}>
              Deadline: {new Date(createdAt).toISOString()}
            </div>
            <div className={styles["submission-status"]}>Not submited</div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
