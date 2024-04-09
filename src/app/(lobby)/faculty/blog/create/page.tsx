import * as React from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { db } from "@/server/db"
import type { SearchParams } from "@/types"
import type { AcademicYear, Faculty } from "@prisma/client"
import { format } from "date-fns"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { facultyParamsSchema } from "@/lib/validations/params"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import styles from "@/styles/(lobby)/faculty/blog/create/page.module.scss"

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
})

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function CreateBlogPage({
  searchParams,
}: SearchPageProps) {
  const { academicYearId } = facultyParamsSchema.parse(searchParams)

  if (academicYearId === "undefined") {
    redirect("/faculty")
  }

  const user = (await currentUser()) as User

  if (user.role !== "STUDENT") {
    redirect("/faculty")
  }

  const faculty = (await db.faculty.findUnique({
    where: { id: user.facultyId ?? "" },
  })) as Faculty

  const academicYear = (await db.academicYear.findUnique({
    where: { id: academicYearId },
  })) as AcademicYear

  if (faculty.status === "SUSPENDED") {
    redirect("/faculty")
  }

  return (
    <div className={styles["layout"]}>
      <div className={styles["inner-layout"]}>
        <div className={styles["header-wrapper"]}>
          <h1>Add new blog</h1>
        </div>

        <div className={styles["info-wrapper"]}>
          <div className={styles["faculty-detail-wrapper"]}>
            <div className={styles["faculty-detail-container"]}>
              <h3>
                Faculty: <span>{faculty.name}</span>
              </h3>
            </div>
          </div>

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
