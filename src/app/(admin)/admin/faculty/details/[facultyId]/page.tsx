import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"

import { type FacultyWithUser } from "@/lib/prisma"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/bread-crumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { EditFaculty } from "@/components/edit-faculty"
import styles from "@/styles/(admin)/faculty/details/page.module.scss"

export default async function FacultyDetailsPage({
  params,
}: {
  params: { facultyId: string }
}) {
  const { facultyId } = params

  const faculty = (await db.faculty.findUnique({
    where: { id: facultyId },
    include: {
      creator: true,
    },
  })) as FacultyWithUser

  return (
    <ScrollArea className={styles["scroll-area"]}>
      <div className={styles["layout-wrapper"]}>
        <div className={styles["layout-container"]}>
          <Breadcrumb className={styles["breadcrumb"]}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/faculty">Faculty</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit ({facultyId})</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className={styles["page-title"]}>
            <div className={styles["page-title-text"]}>
              <h2>Edit Faculty</h2>
              <p>Edit faculty</p>
            </div>
          </div>
          <Separator className={styles["separator"]} />
          <EditFaculty faculty={faculty} />
        </div>
      </div>
    </ScrollArea>
  )
}
