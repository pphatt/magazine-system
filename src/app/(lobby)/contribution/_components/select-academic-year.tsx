"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { AcademicYear } from "@prisma/client"

import { useDebounce } from "@/hooks/use-debounce"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/styles/(contribution)/_components/select-input.module.scss"

export function SelectAcademicYearInput({
  academicYears,
}: {
  academicYears: AcademicYear[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = React.useTransition()

  // Create query string
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

  // Search params
  const academicYearIdParams =
    searchParams?.get("academicYearId") &&
    academicYears.some(({ id }) => id === searchParams.get("academicYearId"))
      ? searchParams.get("academicYearId")!
      : academicYears[0]!.id

  const [academicYearId, setAcademicYearId] =
    React.useState(academicYearIdParams)
  const debouncedAcademicYearId = useDebounce(academicYearId, 0)

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        academicYearId: debouncedAcademicYearId,
      })

      router.push(decodeURIComponent(`${pathname}?${newQueryString}`), {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAcademicYearId])

  const title = React.useMemo(() => {
    return (
      academicYears.find(({ id }) => id === academicYearId)?.name ??
      academicYears[0]!.name
    )
  }, [academicYearId, academicYears])

  return (
    <Select
      defaultValue={academicYearIdParams}
      onValueChange={(value) => setAcademicYearId(value)}
    >
      <SelectTrigger className={styles["select-trigger"]}>
        <SelectValue
          placeholder={title ?? "Select academic year"}
          defaultValue={academicYearIdParams}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className={styles["select-group"]}>
            {academicYears.map(({ id, name }, index) => (
              <SelectItem key={index} value={id}>
                {name}
              </SelectItem>
            ))}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
