import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"
import { User } from "@prisma/client"

import { parserPage } from "@/lib/utils"
import { searchParamsSchema } from "@/lib/validations/params"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/bread-crumb"
import { Separator } from "@/components/ui/separator"
import { AddUser } from "@/components/add-user"
import { columns } from "@/components/tables/user-tables/column"
import { UserDataTable } from "@/components/tables/user-tables/user-data-table"
import styles from "@/styles/(admin)/user/page.module.scss"

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function UserPage({ searchParams }: SearchPageProps) {
  const { q, page, rows } = searchParamsSchema.parse(searchParams)

  const pageNumber = parserPage(page)
  const rowsNumber = parserPage(rows)

  let users: User[]

  if (q !== "undefined") {
    users = await db.user.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
        role: {
          not: "ADMIN",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  } else {
    users = await db.user.findMany({
      skip: (pageNumber - 1) * rowsNumber,
      take: rowsNumber,
      where: {
        role: {
          not: "ADMIN",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  }

  const totalUsers = await db.user.count()

  return (
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
              <BreadcrumbPage>User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className={styles["page-title"]}>
          <div className={styles["page-title-text"]}>
            <h2>User ({totalUsers})</h2>
            <p>Manage users and view their roles</p>
          </div>
          <AddUser />
        </div>
        <Separator className={styles["separator"]} />
        <UserDataTable
          searchKey="name"
          columns={columns}
          data={users}
          totalUsers={totalUsers}
          page={pageNumber}
          rows={rowsNumber}
        />
      </div>
    </div>
  )
}
