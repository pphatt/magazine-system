"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import styles from "@/styles/components/ui/calendar.module.scss"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(styles["day-picker"], className)}
      classNames={{
        months: styles["months"],
        month: styles["month"],
        caption: styles["caption"],
        caption_label: styles["caption-label"],
        nav: styles["nav"],
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          styles["nav-button"]
        ),
        nav_button_previous: styles["nav-button-previous"],
        nav_button_next: styles["nav-button-next"],
        table: styles["table"],
        head_row: styles["head-row"],
        head_cell: styles["head-cell"],
        row: styles["row"],
        cell: styles["cell"],
        day: cn(buttonVariants({ variant: "ghost" }), styles["day"]),
        day_range_end: "day-range-end",
        day_selected: styles["day-selected"],
        day_today: styles["day-today"],
        day_outside: styles["day-outside"],
        day_disabled: styles["day-disabled"],
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className={styles["svg"]} {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className={styles["svg"]} {...props} />
        ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
