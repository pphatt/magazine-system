"use client"

import * as React from "react"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/caousel/faculty-carousel.module.scss"

interface FacultyCarouselProps {
  faculty: { id: string; name: string; _count: { blogs: number } }[]
}

export function FacultyCarousel({ faculty }: FacultyCarouselProps) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
      className={styles["carousel"]}
    >
      <CarouselContent>
        {faculty.map(({ id, name, _count: count }, index) => (
          <CarouselItem key={index} className={styles["carousel-item"]}>
            <div style={{ padding: "0.25rem" }}>
              <Link href={`/contribution?page=1&row=10&facultyId=${id}`}>
                <Card className={styles["card"]}>
                  <CardContent className={styles["carousel-item-card"]}>
                    <Icons.layers className={styles["faculty-icon"]} />
                    <div className={styles["faculty-name"]}>
                      <h3>{name}</h3>
                    </div>
                    <p>Total blogs have published: {count.blogs}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious style={{ top: "42%" }} />
      <CarouselNext style={{ top: "42%" }} />
    </Carousel>
  )
}
