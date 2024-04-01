import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"

import { type UserWithFaculty } from "@/lib/prisma"
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
import { EditUser } from "@/components/edit-user"
import styles from "@/styles/(admin)/user/details/page.module.scss"

export default async function FacultyDetailsPage({
  params,
}: {
  params: { userId: string }
}) {
  const { userId } = params

  const user = (await db.user.findUnique({
    where: { id: userId },
    include: {
      faculty: true,
    },
  })) as UserWithFaculty

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
                  <Link href="/admin/user">User</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className={styles["page-title"]}>
            <div className={styles["page-title-text"]}>
              <h2>Edit User</h2>
              <p>Edit user</p>
            </div>
          </div>
          <Separator className={styles["separator"]} />
          <EditUser user={user} />
        </div>
      </div>
    </ScrollArea>
  )
}
