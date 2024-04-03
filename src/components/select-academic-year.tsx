"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
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
  rows: number
  status: string
  academicYear: AcademicYear | undefined
  academicYears: AcademicYear[]
}

export function SelectAcademicYear({
  rows,
  status,
  academicYear,
  academicYears,
}: SelectAcademicYearProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  const queryURL = React.useCallback(
    (status: string, _rows?: number) => {
      return createQueryString({
        page: 1,
        rows: _rows ?? rows,
        academicYearId: null,
        status: status.toLowerCase(),
      })
    },
    [createQueryString, rows]
  )

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
                href={`${pathname}?${queryURL(status)}&academicYearId=${value.id}`}
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
