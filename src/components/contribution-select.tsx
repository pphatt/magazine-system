import * as React from "react"
import Link from "next/link"
import type { AcademicYear, Faculty } from "@prisma/client"
import { isBefore } from "date-fns"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/select-group-list.module.scss"
import { SelectAcademicYearInput } from "@/app/(lobby)/contribution/_components/select-academic-year"
import { SelectFacultyInput } from "@/app/(lobby)/contribution/_components/select-faculty"
import { SelectRowInput } from "@/app/(lobby)/contribution/_components/select-row"
import { SelectStatusInput } from "@/app/(lobby)/contribution/_components/select-status"

interface ContributionSelectProps {
  faculties: Faculty[]
  academicYears: AcademicYear[]
  academicYear?: AcademicYear
  role: string
}

export function ContributionSelect({
  faculties,
  academicYears,
  academicYear,
  role,
}: ContributionSelectProps) {
  return (
    <div className={styles["select-wrapper"]}>
      {role !== ("student" as string) && role !== ("guest" as string) && (
        <>
          {role !== "marketing_coordinator" && (
            <>
              <SelectFacultyInput faculties={faculties} />
            </>
          )}

          <SelectStatusInput />
        </>
      )}

      {role !== "guest" && (
        <SelectAcademicYearInput academicYears={academicYears} />
      )}

      <div className={styles["add-new-blog-wrapper"]}>
        {role === "student" &&
          isBefore(Date.now(), academicYear?.closureDate ?? Date.now()) && (
            <Button
              variant={"outline"}
              className={styles["add-new-blog"]}
              asChild
            >
              <Link
                href={`/contribution/blog/create?academicYearId=${academicYear?.id ? academicYear.id : ""}`}
              >
                <Icons.circlePlus />
                Add new blog
              </Link>
            </Button>
          )}

        <SelectRowInput />
      </div>
    </div>
  )
}
