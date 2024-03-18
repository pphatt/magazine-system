"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import styles from "@/styles/(lobby)/_components/carousel.module.scss"

export function CarouselSize() {
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const handleMouseEnter = plugin.current.stop as () => void

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const handleMouseLeave = plugin.current.reset as () => void

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {Array.from({ length: 2 }).map((_, index) => (
          <CarouselItem key={index}>
            <img src={"/carousel-image-1.png"} className={styles["image"]} alt={""} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
