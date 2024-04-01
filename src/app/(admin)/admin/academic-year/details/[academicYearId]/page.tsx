import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"

import { type AcademicYearWithUser } from "@/lib/prisma"
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
import { EditAcademicYear } from "@/components/edit-academic-year"
import styles from "@/styles/(admin)/faculty/details/page.module.scss"

export default async function AcademicYearDetailsPage({
  params,
}: {
  params: { academicYearId: string }
}) {
  const { academicYearId } = params

  const academicYear = (await db.academicYear.findUnique({
    where: { id: academicYearId },
    include: {
      creator: true,
    },
  })) as AcademicYearWithUser

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
                  <Link href="/admin/academic-year">Academic Year</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Academic Year</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className={styles["page-title"]}>
            <div className={styles["page-title-text"]}>
              <h2>Edit Academic Year</h2>
              <p>Edit academic year</p>
            </div>
          </div>
          <Separator className={styles["separator"]} />
          <EditAcademicYear academicYear={academicYear} />
        </div>
      </div>
    </ScrollArea>
  )
}
