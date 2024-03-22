import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { currentUser } from "@/lib/auth/auth"
import { Button } from "@/components/ui/button"
import { FacultyWorkspace } from "@/components/faculty-workspace"
import { Icons } from "@/components/icons"
import styles from "@/styles/(faculty)/page.module.scss"

export default async function FacultyPage() {
  const user = await currentUser()

  if (!user || !user.faculty) {
    redirect("/")
  }

  const isMarketingCoordinate = user.role === "MARKETING_COORDINATOR"

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles["page-header-wrapper"]}>
        <span className={styles["page-header-text"]}>Faculty Workspaces</span>
        {isMarketingCoordinate && (
          <div className={styles["page-header-group"]}>
            <Button asChild>
              <Link href={"/faculty/new"}>
                <Icons.plus />
                Create a new workspace
              </Link>
            </Button>
          </div>
        )}
      </div>

      <FacultyWorkspace user={user} />
    </div>
  )
}
