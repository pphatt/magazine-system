import * as React from "react"
import type { AcademicYear, Faculty } from "@prisma/client"

import styles from "@/styles/components/select-group-list.module.scss"
import { SelectAcademicYearInput } from "@/app/(lobby)/contribution/_components/select-academic-year"
import { SelectFacultyInput } from "@/app/(lobby)/contribution/_components/select-faculty"
import { SelectRowInput } from "@/app/(lobby)/contribution/_components/select-row"
import { SelectStatusInput } from "@/app/(lobby)/contribution/_components/select-status"

interface ContributionSelectProps {
  faculties: Faculty[]
  academicYears: AcademicYear[]
  role: string
}

export function ContributionSelect({
  faculties,
  academicYears,
  role,
}: ContributionSelectProps) {
  return (
    <div className={styles["select-wrapper"]}>
      {role !== "marketing_coordinator" && role !== "guest" && (
        <>
          <SelectFacultyInput faculties={faculties} />
        </>
      )}

      {role !== ("student" as string) && role !== ("guest" as string) && (
        <>
          <SelectStatusInput />
        </>
      )}

      {role !== "guest" && (
        <SelectAcademicYearInput academicYears={academicYears} />
      )}

      <div className={styles["add-new-blog-wrapper"]}>
        <SelectRowInput />
      </div>
    </div>
  )
}
