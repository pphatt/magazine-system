"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "@/styles/components/select-rows.module.scss"

interface SelectRowsProps {
  rows: number
}

export function SelectRows({ rows }: SelectRowsProps) {
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
    (_rows?: number) => {
      return createQueryString({
        page: null,
        rows: _rows ?? rows,
      })
    },
    [createQueryString, rows]
  )

  return (
    <div className={styles["select-wrapper"]}>
      <Select>
        <SelectTrigger className={styles["select-trigger"]}>
          <SelectValue
            placeholder={rows ?? "Select rows"}
            defaultValue={rows ?? 10}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <div className={styles["select-group"]}>
              {[5, 10, 15, 20].map((value, index) => (
                <Link
                  key={index}
                  href={`${pathname}?page=1&${queryURL(value)}`}
                  className={styles["select-item"]}
                  data-select={value === rows}
                >
                  {value}
                </Link>
              ))}
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
