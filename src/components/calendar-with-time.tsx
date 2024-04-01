import * as React from "react"
import type { ChangeEventHandler } from "react"
import { format, set } from "date-fns"
import type { SelectSingleEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/calendar-with-time.module.scss"

interface CalendarWithTimeProps {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  dateWithTime: Date
  setDateWithTime: React.Dispatch<React.SetStateAction<Date>>
  onChange: (...event: unknown[]) => void
}

export function CalendarWithTime({
  date,
  setDate,
  dateWithTime,
  setDateWithTime,
  onChange,
}: CalendarWithTimeProps) {
  const handleDateTimeSelect: ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const { value } = e.target

        const hours = Number.parseInt(value.split(":")[0] || "00", 10)
        const minutes = Number.parseInt(value.split(":")[1] || "00", 10)
        const seconds = Number.parseInt(value.split(":")[2] || "00", 10)

        setDateWithTime(set(date, { hours, minutes, seconds }))
      },
      [date, setDateWithTime]
    )

  const handleDateSelect: SelectSingleEventHandler = React.useCallback(
    (_day, selected) => {
      setDate(selected)

      const hours = dateWithTime.getHours()
      const minutes = dateWithTime.getMinutes()
      const seconds = dateWithTime.getSeconds()

      setDateWithTime(set(selected, { hours, minutes, seconds }))
    },
    [dateWithTime, setDate, setDateWithTime]
  )

  React.useEffect(() => {
    onChange(dateWithTime)
  }, [dateWithTime, onChange])

  const timePicker = (
    <div className={styles["calender-footer"]}>
      <label>Time: </label>
      <input
        type="time"
        step="1"
        onChange={handleDateTimeSelect}
        value={format(dateWithTime, "HH:mm:ss")}
      />
    </div>
  )

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                styles["calender-trigger"],
                !date && styles["not-selected"]
              )}
            >
              {date ? (
                format(dateWithTime, "PPP HH:mm:ss")
              ) : (
                <span>Pick a date</span>
              )}
              <Icons.calendarIcon className={styles["calendar-icon"]} />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className={styles["popover-content"]} align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            footer={timePicker}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
