"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { status as sortByStatus } from "@/config/filter"
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

export function SelectStatusInput() {
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
  const statusParams =
    searchParams &&
    searchParams.get("status") &&
    sortByStatus.some(({ value }) => value === searchParams.get("status"))
      ? searchParams.get("status")!
      : "pending"

  const [status, setStatus] = React.useState(statusParams)
  const debouncedStatus = useDebounce(status, 0)

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        page: 1,
        status: debouncedStatus,
      })

      router.push(decodeURIComponent(`${pathname}?${newQueryString}`), {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedStatus])

  const title = React.useMemo(() => {
    return (
      sortByStatus.find(({ value }) => value === status)?.text ?? "All Blogs"
    )
  }, [status])

  return (
    <Select
      defaultValue={statusParams}
      onValueChange={(value) => setStatus(value)}
    >
      <SelectTrigger className={styles["select-trigger"]}>
        <SelectValue
          placeholder={title ?? "Select status"}
          defaultValue={status}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className={styles["select-group"]}>
            {sortByStatus.map(({ value, text }, index) => (
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
