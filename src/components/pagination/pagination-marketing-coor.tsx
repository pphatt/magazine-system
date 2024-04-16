"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

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

interface PaginationMarketingCoorProps {
  page: number
  rows: number
  academicYearId: string
  status: string
  totalBlogs: number
}

export function PaginationMarketingCoor({
  page,
  rows,
  academicYearId,
  status,
  totalBlogs,
}: PaginationMarketingCoorProps) {
  const canNextPage = totalBlogs > rows * page
  const canPrevPage = page > 1
  const totalPages = Math.ceil(totalBlogs / rows)

  const pathname = usePathname()

  const paginationArr = generatePagination(page, totalPages)

  return (
    <div className={styles["pagination-group-list"]}>
      <Pagination className={styles["pagination"]}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={!canPrevPage}
              tabIndex={!canPrevPage ? -1 : undefined}
              className={!canPrevPage ? styles["disabled"] : undefined}
              href={`${pathname}?page=${page - 1}&row=${rows}&academicYear=${academicYearId}&status=${status.toLowerCase()}`}
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
                href={`${pathname}?page=${value}&row=${rows}&academicYear=${academicYearId}&status=${status.toLowerCase()}`}
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
              href={`${pathname}?page=${page + 1}&row=${rows}&academicYear=${academicYearId}&status=${status.toLowerCase()}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
