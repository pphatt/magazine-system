import * as React from "react"
import Link from "next/link"
import type { SearchParams } from "@/types"

import {
  getAcademicYearCount,
  getAcademicYearWithUser,
} from "@/lib/fetchers/academic-year"
import { type AcademicYearWithUser } from "@/lib/prisma"
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
import { AddAcademicYear } from "@/components/add-academic-year"
import { AcademicYearDataTable } from "@/components/tables/academic-year-tables/academic-year-data-table"
import { columns } from "@/components/tables/academic-year-tables/column"
import styles from "@/styles/(admin)/academic-year/page.module.scss"

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function AcademicYearPage({
  searchParams,
}: SearchPageProps) {
  const { q, page, rows } = searchParamsSchema.parse(searchParams)

  const pageNumber = parserPage(page)
  const rowsNumber = parserRows(rows, 10)

  const academicYears = (await getAcademicYearWithUser({
    query: q,
    pageNumber,
    rowsNumber,
  })) as AcademicYearWithUser[]

  const totalAcademicYears = (await getAcademicYearCount(q)) as number

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
              <BreadcrumbPage>Academic Years</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className={styles["page-title"]}>
          <div className={styles["page-title-text"]}>
            <h2>Academic Year ({totalAcademicYears})</h2>
            <p>Manage academic year</p>
          </div>
          <AddAcademicYear />
        </div>
        <Separator className={styles["separator"]} />
        <AcademicYearDataTable
          columns={columns}
          data={academicYears}
          searchKey={"name"}
          totalAcademicYears={totalAcademicYears}
          page={pageNumber}
          rows={rowsNumber}
        />
      </div>
    </div>
  )
}
