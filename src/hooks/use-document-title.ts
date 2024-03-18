import { useIsomorphicEffect } from "@/hooks/use-isomorphic-effect"

export function useDocumentTitle(title: string) {
  useIsomorphicEffect(() => {
    if (title.trim().length > 0) {
      document.title = title.trim()
    }
  }, [title])
}
