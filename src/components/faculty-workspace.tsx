import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/server/db"
import { format } from "date-fns"
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

  const contributionCount: number[] = []
  const isSubmitted: string[] = []

  const isStudentRole = user.role === "STUDENT"

  for (const w of workspace) {
    if (!isStudentRole) {
      const count = await db.contributions.count({
        where: { workspaceId: w.id },
      })

      contributionCount.push(count)
    } else {
      const submit = await db.contributions.findFirst({
        where: { workspaceId: w.id, authorId: user.id },
      })

      isSubmitted.push(submit ? "Submitted" : "Not submitted")
    }
  }

  return (
    <ul className={styles["workspace-wrapper"]}>
      {workspace.map(({ id, title, closureDate, finalClosureDate }, index) => (
        <li key={index} className={styles["item-wrapper"]}>
          <Link
            href={`/faculty/magazine/${id}`}
            className={styles["item-container"]}
          >
            <div className={styles["item-title"]}>{title}</div>
            <div className={styles["item-datetime"]}>
              <span>Closure Date:</span> {format(closureDate, "PPpp")}
            </div>
            <div className={styles["item-datetime"]}>
              <span>Final Closure Date:</span>{" "}
              {format(finalClosureDate, "PPpp")}
            </div>
            {isStudentRole && (
              <div
                className={styles["submission-status"]}
                data-submit={isSubmitted[index]}
              >
                {isSubmitted[index]}
              </div>
            )}

            {!isStudentRole && (
              <div className={styles["contribution-count"]}>
                Total contribution: {contributionCount[index]}
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
