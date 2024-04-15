import * as React from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"
import type { AcademicYear, Faculty } from "@prisma/client"
import { format, isAfter } from "date-fns"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { contributionParamsSchema } from "@/lib/validations/params"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/bread-crumb"
import styles from "@/styles/(lobby)/contribution/blog/create/page.module.scss"

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
})

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function CreateBlogPage({
  searchParams,
}: SearchPageProps) {
  const { academicYearId } = contributionParamsSchema.parse(searchParams)

  if (academicYearId === "undefined") {
    redirect("/contribution")
  }

  const user = (await currentUser()) as User

  if (user.role !== "STUDENT") {
    redirect("/contribution")
  }

  const faculty = (await db.faculty.findUnique({
    where: { id: user.facultyId ?? "" },
  })) as Faculty

  const academicYear = (await db.academicYear.findUnique({
    where: { id: academicYearId },
  })) as AcademicYear

  if (isAfter(Date.now(), academicYear.closureDate)) {
    redirect("/contribution")
  }

  if (faculty.status === "SUSPENDED" || academicYear.status === "SUSPENDED") {
    redirect("/contribution")
  }

  return (
    <div className={styles["layout"]}>
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
            <BreadcrumbLink asChild>
              <Link href={"/contribution"}>{faculty?.name ?? "-"}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={styles["inner-layout"]}>
        <div className={styles["header-wrapper"]}>
          <h1>Add new blog</h1>
        </div>

        <div className={styles["info-wrapper"]}>
          <div className={styles["faculty-detail-wrapper"]}>
            <div className={styles["faculty-detail-container"]}>
              <h3>
                Academic Year: <span>{academicYear.name}</span>
              </h3>
              <p>
                Start Date: <span>{format(academicYear.startDate, "PPP")}</span>
              </p>
              <p>
                Closure Date:{" "}
                <span>{format(academicYear.closureDate, "PPP")}</span>
              </p>
            </div>
          </div>
        </div>

        <Suspense>
          <Editor
            academicYearId={academicYearId}
            facultyId={user.facultyId ?? ""}
          />
        </Suspense>
      </div>
    </div>
  )
}
