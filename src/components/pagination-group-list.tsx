"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { generatePagination } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import styles from "@/styles/components/pagination-group-list.module.scss"

interface PaginationGroupListProps {
  page: number
  rows: number
  status: string
  totalBlogs: number
}

export function PaginationGroupList({
  page,
  rows,
  status,
  totalBlogs,
}: PaginationGroupListProps) {
  const canNextPage = totalBlogs > rows * page
  const canPrevPage = page > 1
  const totalPages = Math.ceil(totalBlogs / rows)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const paginationArr = generatePagination(page, totalPages)

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

  const queryURL = React.useCallback(() => {
    return createQueryString({
      page: null,
      rows,
      status: status.toLowerCase(),
    })
  }, [createQueryString, rows, status])

  return (
    <div className={styles["pagination-group-list"]}>
      <Pagination className={styles["pagination"]}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!canPrevPage}
              tabIndex={!canPrevPage ? -1 : undefined}
              className={!canPrevPage ? styles["disabled"] : undefined}
              href={`${pathname}?page=${page - 1}&${queryURL()}`}
            />
          </PaginationItem>
          {paginationArr[0] && paginationArr[0] < 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {paginationArr.map((value, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={`${pathname}?page=${value}&${queryURL()}`}
                isActive={value === page}
              >
                {value}
              </PaginationLink>
            </PaginationItem>
          ))}
          {paginationArr[paginationArr.length - 1] &&
            paginationArr[paginationArr.length - 1]! > totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          <PaginationItem>
            <PaginationNext
              aria-disabled={!canNextPage}
              tabIndex={!canNextPage ? -1 : undefined}
              className={!canNextPage ? styles["disabled"] : undefined}
              href={`${pathname}?page=${page + 1}&${queryURL()}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
