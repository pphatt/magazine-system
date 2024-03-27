import classNames, { type ArgumentArray } from "classnames"
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns"
import { toast } from "sonner"

export function cn(...inputs: ArgumentArray) {
  return classNames(inputs)
}

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function catchNextAuthError(err: unknown) {
  if (typeof err === "string") {
    return toast(err)
  }

  return toast(JSON.stringify(err))
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
