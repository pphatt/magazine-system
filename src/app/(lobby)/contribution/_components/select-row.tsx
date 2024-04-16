"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { blogsRow as sortByRow } from "@/config/filter"
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

export function SelectRowInput() {
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
  const rowParams =
    searchParams?.get("row") &&
    sortByRow.some(({ value }) => value === searchParams.get("row"))
      ? searchParams.get("row")!
      : "10"

  const [row, setRow] = React.useState(rowParams)
  const debouncedRow = useDebounce(row, 0)

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        page: 1,
        row: debouncedRow,
      })

      router.push(decodeURIComponent(`${pathname}?${newQueryString}`), {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRow])

  const title = React.useMemo(() => {
    return sortByRow.find(({ value }) => value === row)?.text ?? "10"
  }, [row])

  return (
    <Select defaultValue={rowParams} onValueChange={(value) => setRow(value)}>
      <SelectTrigger className={styles["select-trigger"]}>
        <SelectValue placeholder={title ?? "Select row"} defaultValue={row} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className={styles["select-group"]}>
            {sortByRow.map(({ value, text }, index) => (
              <SelectItem key={index} value={value}>
                {text}
              </SelectItem>
            ))}
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
