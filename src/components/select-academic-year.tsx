"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type AcademicYear } from "@prisma/client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/styles/components/tables/user-tables/user-data-table.module.scss"

interface SelectAcademicYearProps {
  academicYear: AcademicYear | undefined
  academicYears: AcademicYear[]
}

export function SelectAcademicYear({
  academicYear,
  academicYears,
}: SelectAcademicYearProps) {
  const pathname = usePathname()

  return (
    <Select>
      <SelectTrigger>
        <SelectValue
          placeholder={academicYear?.name ?? "Select academic year"}
          defaultValue={academicYear ? academicYear.id : "-"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className={styles["select-group"]}>
            {academicYears.map((value, index) => (
              <Link
                key={index}
                href={`${pathname}?academicYearId=${value.id}`}
                className={styles["select-item"]}
                data-select={value.id === academicYear?.id}
              >
                {value.name}
              </Link>
            ))}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
