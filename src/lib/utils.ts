import classNames, { type ArgumentArray } from "classnames"
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
