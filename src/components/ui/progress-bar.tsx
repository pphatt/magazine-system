"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import styles from "@/styles/components/ui/progress-bar.module.scss"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(styles["slider"], className)}
    {...props}
  >
    <SliderPrimitive.Track className={styles["slider-bar"]}>
      <SliderPrimitive.Range />
      {props.children}
    </SliderPrimitive.Track>
    {/*<SliderPrimitive.Thumb className={styles["slider-knob"]} />*/}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

const SliderPercentage = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(styles["slider-percentage"], className)}
    {...props}
  >
    <SliderPrimitive.Track className={styles["slider-percentage-bar"]}>
      <SliderPrimitive.Range />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={styles["slider-percentage-knob"]} />
  </SliderPrimitive.Root>
))
SliderPercentage.displayName = SliderPrimitive.Root.displayName

export { Slider, SliderPercentage }
