"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useDebounce } from "@/hooks/use-debounce"
import { useMounted } from "@/hooks/use-mounted"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { SearchInputLoading } from "@/components/loading/search-input-loading"
import styles from "@/styles/(contribution)/_components/search-input.module.scss"

export function SearchInput() {
  const mounted = useMounted()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = React.useTransition()

  // Search params
  const q = searchParams?.get("q") ?? ""

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

  // Query filter
  const [query, setQuery] = React.useState<string>(q)
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        q: debouncedQuery !== "" ? debouncedQuery : null,
      })

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <>
      <div className={styles["search-filter-layout"]}>
        <div className={styles["search-bar"]}>
          {!mounted && <SearchInputLoading />}

          {mounted && (
            <div className={styles["search"]}>
              <Icons.search />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value.toLowerCase())
                }}
                placeholder={"Search"}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
