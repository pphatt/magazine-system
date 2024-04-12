"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { Faculty } from "@prisma/client"

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

export function SelectFacultyInput({ faculties }: { faculties: Faculty[] }) {
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
  const facultyIdParams =
    searchParams?.get("facultyId") &&
    faculties.some(({ id }) => id === searchParams.get("facultyId"))
      ? searchParams.get("facultyId")!
      : faculties[0]!.id

  const [facultyId, setFacultyId] = React.useState(facultyIdParams)
  const debouncedFacultyId = useDebounce(facultyId, 0)

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        facultyId: debouncedFacultyId,
      })

      router.push(decodeURIComponent(`${pathname}?${newQueryString}`), {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFacultyId])

  const title = React.useMemo(() => {
    return (
      faculties.find(({ id }) => id === facultyId)?.name ?? faculties[0]!.name
    )
  }, [faculties, facultyId])

  return (
    <Select
      defaultValue={facultyIdParams}
      onValueChange={(value) => setFacultyId(value)}
    >
      <SelectTrigger className={styles["select-trigger"]}>
        <SelectValue
          placeholder={title ?? "Select faculty"}
          defaultValue={facultyIdParams}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className={styles["select-group"]}>
            {faculties.map(({ id, name }, index) => (
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
