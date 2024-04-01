import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"

import {
  getUserCountNotIncludeAdmin,
  getUserWithFaculty,
} from "@/lib/fetchers/user"
import { type UserWithFaculty } from "@/lib/prisma"
import { parserPage, parserRows } from "@/lib/utils"
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
  const rowsNumber = parserRows(rows, 50)

  const users = (await getUserWithFaculty({
    query: q,
    pageNumber,
    rowsNumber,
  })) as UserWithFaculty[]

  const totalUsers = (await getUserCountNotIncludeAdmin(q)) as number

  const getAllFaculty = await db.faculty.findMany()

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
          <AddUser faculty={getAllFaculty} />
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
