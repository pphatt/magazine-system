"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { createQueryString, generatePagination } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import styles from "@/styles/components/pagination-rows.module.scss"

interface PaginationLikeBlogsProps {
  query: string
  page: number
  rows: number
  totalBlogs: number
}

export function PaginationLikeBlogs({
  query,
  page,
  rows,
  totalBlogs,
}: PaginationLikeBlogsProps) {
  const canNextPage = totalBlogs > rows * page
  const canPrevPage = page > 1
  const totalPages = Math.ceil(totalBlogs / rows)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const paginationArr = generatePagination(page, totalPages)

  const queryURL = React.useCallback(() => {
    return createQueryString(
      {
        q: query ? query : null,
        page: null,
        row: rows,
      },
      searchParams
    )
  }, [query, rows, searchParams])

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
