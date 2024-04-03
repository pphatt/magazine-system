import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"
import { type StatusEnum } from "@prisma/client"
import { format } from "date-fns"
import { type User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { parserPage, parserRows } from "@/lib/utils"
import { facultyParamsSchema } from "@/lib/validations/params"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MarketingCoorBlogsList } from "@/components/marketing-coor-blogs-list"
import { SelectAcademicYear } from "@/components/select-academic-year"
import { StudentBlogsList } from "@/components/student-blogs-list"
import styles from "@/styles/(faculty)/page.module.scss"

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function FacultyPage({ searchParams }: SearchPageProps) {
  const { academicYearId, status, page, rows } =
    facultyParamsSchema.parse(searchParams)

  // get search query
  const pageNumber = parserPage(page)
  const rowsNumber = parserRows(rows, 10)

  // get user info
  const user = (await currentUser()) as User

  const faculty = await db.faculty.findUnique({
    where: { id: user?.facultyId ?? "" },
  })

  // get total academic years and current selected academic year
  const academicYears = await db.academicYear.findMany()
  const academicYear =
    academicYears.find((value) => value.id === academicYearId) ??
    academicYears[0]

  // user === student || guest || mc => user.facultyId, searchParams.academicYearId
  // user === admin || mm => searchParams.facultyId, searchParams.academicYearId

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles["filter-wrapper"]}>
        <Card className={styles["faculty-card"]}>
          <CardHeader>
            <CardTitle>Faculty</CardTitle>
            <CardDescription>
              Faculty&apos;s name:{" "}
              <span className={styles["faculty-text"]}>
                {faculty?.name ?? "-"}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className={styles["faculty-card"]}>
          <CardHeader>
            <CardTitle>Academic Year</CardTitle>
            <CardContent className={styles["card-content"]}>
              <SelectAcademicYear
                academicYear={academicYear}
                academicYears={academicYears}
              />
              <div className={styles["academic-year-details"]}>
                <div className={styles["academic-year-detail"]}>
                  <div>Name:</div>
                  <span>{academicYear?.name ?? "-"}</span>
                </div>
                <div className={styles["academic-year-detail"]}>
                  <div>Description:</div>
                  <span>{academicYear?.description ?? "-"}</span>
                </div>
                <div className={styles["academic-year-detail"]}>
                  <div>Start Date:</div>
                  <span>{format(academicYear?.startDate ?? "-", "PPP")}</span>
                </div>
                <div className={styles["academic-year-detail"]}>
                  <div>Closure Date:</div>
                  <span>{format(academicYear?.closureDate ?? "-", "PPP")}</span>
                </div>
              </div>
              {user.role === "STUDENT" && (
                <Button
                  variant={"outline"}
                  className={styles["add-new-blog"]}
                  asChild
                >
                  <Link
                    href={`/faculty/blog/create?academicYearId=${academicYearId ? academicYear?.id : "empty"}`}
                  >
                    Add new blog
                  </Link>
                </Button>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
      <div className={styles["blogs-list"]}>
        {user?.role === "STUDENT" && (
          <StudentBlogsList facultyId={user.facultyId ?? ""} />
        )}

        {user?.role === "MARKETING_COORDINATOR" && (
          <MarketingCoorBlogsList
            page={pageNumber}
            rows={rowsNumber}
            status={status as StatusEnum}
            facultyId={user.facultyId ?? ""}
            academicYearId={academicYear?.id ?? ""}
          />
        )}
      </div>
    </div>
  )
}
