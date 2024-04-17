import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"
import { type StatusEnum } from "@prisma/client"
import { type User } from "next-auth"

import { status as sortByStatus } from "@/config/filter"
import { currentUser } from "@/lib/auth/auth"
import { parserPage, parserRows } from "@/lib/utils"
import { contributionParamsSchema } from "@/lib/validations/params"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/bread-crumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContributionSelect } from "@/components/contribution-select"
import { MarketingCoorBlogsList } from "@/components/marketing-coor-blogs-list"
import { MarketingManagerBlogList } from "@/components/marketing-manager-blog-list"
import { StudentBlogsList } from "@/components/student-blogs-list"
import styles from "@/styles/(contribution)/page.module.scss"
import { SearchInput } from "@/app/(lobby)/contribution/_components/search-input"

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function FacultyPage({ searchParams }: SearchPageProps) {
  const { facultyId, academicYearId, status, page, row, q } =
    contributionParamsSchema.parse(searchParams)

  // get a search query
  const pageNumber = parserPage(page)
  const rowsNumber = parserRows(row, 10)
  const parserStatus = sortByStatus.some(({ value }) => value === status)
    ? status
    : "PENDING"

  // get user info
  const user = (await currentUser()) as User

  const faculties = await db.faculty.findMany()
  const faculty =
    faculties.find((value) => value.id === facultyId) ?? faculties[0]

  const academicYears = await db.academicYear.findMany({
    where: { status: "ACTIVE" },
    orderBy: {
      createdAt: "asc",
    },
  })

  const academicYear =
    academicYears.find((value) => value.id === academicYearId) ??
    academicYears[0]

  return (
    <div className={styles["page-wrapper"]}>
      <Breadcrumb className={styles["breadcrumb"]}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/contribution">Contributions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {user.facultyId ? faculty?.name : "-"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <SearchInput />

      <ContributionSelect
        faculties={faculties}
        academicYears={academicYears}
        role={user.role.toLowerCase()}
      />

      {faculty && faculty.status === "SUSPENDED" ? (
        <Card className={styles["faculty-card"]}>
          <CardHeader className={styles["faculty-card-header"]}>
            <CardTitle>Faculty Maintaining</CardTitle>
          </CardHeader>
          <CardContent className={styles["card-content"]}>
            <h1>Faculty is under maintained</h1>
          </CardContent>
        </Card>
      ) : (
        <>
          {user?.role === "STUDENT" && (
            <StudentBlogsList
              query={q}
              page={pageNumber}
              rows={rowsNumber}
              facultyId={faculty?.id ?? ""}
              academicYearId={academicYear?.id ?? ""}
            />
          )}

          {user?.role === "MARKETING_COORDINATOR" && (
            <MarketingCoorBlogsList
              query={q}
              page={pageNumber}
              rows={rowsNumber}
              status={parserStatus.toLowerCase() as StatusEnum}
              facultyId={user.facultyId ?? ""}
              academicYearId={academicYear?.id ?? ""}
            />
          )}

          {(user?.role === "ADMIN" || user.role === "MARKETING_MANAGER") && (
            <MarketingManagerBlogList
              query={q}
              page={pageNumber}
              rows={rowsNumber}
              status={parserStatus.toLowerCase() as StatusEnum}
              academicYearId={academicYear?.id ?? ""}
              facultyId={faculty?.id ?? ""}
            />
          )}
        </>
      )}
    </div>
  )
}
