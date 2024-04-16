import { ReadonlyURLSearchParams } from "next/navigation"
import classNames, { type ArgumentArray } from "classnames"
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  formatDistanceToNowStrict,
} from "date-fns"
import locale from "date-fns/locale/en-US"
import { toast } from "sonner"

export function cn(...inputs: ArgumentArray) {
  return classNames(inputs)
}

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function catchNextAuthError(err: unknown) {
  if (typeof err === "string") {
    return toast.error(err)
  }

  return toast.error(JSON.stringify(err))
}

export function formatTimeForSubmissionDiff(day: Date, dayCompare: Date) {
  const daysDiff = differenceInDays(day, dayCompare)
  const hoursDiff = differenceInHours(day, dayCompare) - daysDiff * 24
  const minutesDiff =
    differenceInMinutes(day, dayCompare) - (daysDiff * 24 * 60 + hoursDiff * 60)
  const secondsDiff =
    differenceInSeconds(day, dayCompare) -
    (daysDiff * 24 * 60 * 60 + hoursDiff * 60 * 60 + minutesDiff * 60)

  let result = ""

  if (daysDiff > 0) {
    result += `${daysDiff} day${daysDiff > 1 ? "s" : ""} `
    if (hoursDiff > 0) {
      result += `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""}`
    }
  } else if (hoursDiff > 0) {
    result += `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} `
    if (minutesDiff > 0) {
      result += `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""}`
    }
  } else if (minutesDiff > 0) {
    result += `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} `
    if (secondsDiff > 0) {
      result += `${secondsDiff} second${secondsDiff > 1 ? "s" : ""}`
    }
  } else {
    result += `${secondsDiff} second${secondsDiff > 1 ? "s" : ""}`
  }

  return result
}

export function parserPage(page: string) {
  let pageNumber: number

  try {
    pageNumber = parseInt(page) || 1
    if (pageNumber < 1) pageNumber = 1
  } catch (e) {
    pageNumber = 1
  }

  return pageNumber
}

export function parserRows(rows: string, defaultValue: number) {
  let _rows: number

  try {
    _rows = parseInt(rows) || defaultValue
    if (_rows < 1) _rows = defaultValue
  } catch (e) {
    _rows = defaultValue
  }

  return _rows
}

export function generatePagination(activePage: number, totalPages: number) {
  const paginationLength = 5

  let startPage = Math.max(1, activePage - Math.floor(paginationLength / 2))
  const endPage = Math.min(totalPages, startPage + paginationLength - 1)
  const pagination = []

  if (endPage - startPage + 1 < paginationLength) {
    startPage = Math.max(1, endPage - paginationLength + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.push(i)
  }

  return pagination
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
}

interface FormatDistanceOptions {
  addSuffix?: boolean
  comparison?: number
}

function formatDistance(
  token: string,
  count: number,
  options?: FormatDistanceOptions
): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString())

  if (options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result
    } else {
      if (result === "just now") return result
      return result + " ago"
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export function createQueryString(
  params: Record<string, string | number | null>,
  searchParams: ReadonlyURLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString())

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, String(value))
    }
  }

  return newSearchParams.toString()
}
