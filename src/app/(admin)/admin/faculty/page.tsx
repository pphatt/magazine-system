import * as React from "react"
import Link from "next/link"
import type { SearchParams } from "@/types"

import { getFacultyCount, getFacultyWithUser } from "@/lib/fetchers/faculty"
import { type FacultyWithUser } from "@/lib/prisma"
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
import { AddFaculty } from "@/components/add-faculty"
import { columns } from "@/components/tables/faculty-tables/column"
import { FacultyDataTable } from "@/components/tables/faculty-tables/faculty-data-table"
import styles from "@/styles/(admin)/faculty/page.module.scss"

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function FacultyPage({ searchParams }: SearchPageProps) {
  const { q, page, rows } = searchParamsSchema.parse(searchParams)

  const pageNumber = parserPage(page)
  const rowsNumber = parserRows(rows, 10)

  const faculties: FacultyWithUser[] = (await getFacultyWithUser({
    query: q,
    pageNumber,
    rowsNumber,
  })) as FacultyWithUser[]

  const totalFaculties = (await getFacultyCount(q)) as number

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
              <BreadcrumbPage>Faculty</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className={styles["page-title"]}>
          <div className={styles["page-title-text"]}>
            <h2>Faculty ({totalFaculties})</h2>
            <p>Manage faculties</p>
          </div>
          <AddFaculty />
        </div>
        <Separator className={styles["separator"]} />
        <FacultyDataTable
          searchKey="name"
          columns={columns}
          data={faculties}
          totalFaculty={totalFaculties}
          page={pageNumber}
          rows={rowsNumber}
        />
      </div>
    </div>
  )
}
