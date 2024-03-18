"use client"

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { useMounted } from "@/hooks/use-mounted"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/layouts/theme-toggle.module.scss"

export function ThemeToggle() {
  const mounted = useMounted()
  const { setTheme, theme } = useTheme()

  if (!mounted) {
    return <Skeleton className={styles["theme-button-skeleton"]} />
  }

  return (
    <Button
      variant={"outline"}
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={styles["theme-button"]}
      data-theme={theme}
    >
      <SunIcon className={styles["sun"]} aria-hidden="true" />
      <MoonIcon className={styles["moon"]} aria-hidden="true" />
      <Icons.laptop className={styles["system"]} aria-hidden="true" />
      <span className={styles["text"]}>Toggle theme</span>
    </Button>
  )
}
