"use client"

import * as React from "react"
import Link from "next/link"
import { env } from "@/env"
import type { Block } from "@/types"
import { format } from "date-fns"

import type { ContributionWithUser } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "@/styles/components/blog-card.module.scss"

interface BlogCardProps {
  contributions: ContributionWithUser[]
}

export function BlogCard({ contributions }: BlogCardProps) {
  return (
    <div className={styles["blog-section-wrapper"]}>
      {contributions.map(
        ({ id, title, content, backgroundImage, createdAt, author }, index) => {
          const desc = content as { blocks: Block[] }

          return (
            <Link
              href={`/contribution/blog/${id}`}
              className={styles["blog-wrapper"]}
              key={index}
            >
              <div className={styles["blog-image-wrapper"]}>
                <div className={styles["blog-image-container"]}>
                  <div className={styles["blog-image"]}>
                    <div className={styles["blog-image-pseudo"]}>
                      <img
                        src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/${backgroundImage}`}
                        alt={title}
                        className={styles["image"]}
                      />
                    </div>
                  </div>
                </div>
                <span className={styles["seo-title"]}>{title}</span>
              </div>
              <div className={styles["blog-details"]}>
                <div className={styles["blog-author-details"]}>
                  <Avatar className={styles["avatar"]}>
                    <AvatarImage
                      src={author.image ?? ""}
                      alt={""}
                      className={styles["avatar-image"]}
                    />
                    <AvatarFallback>
                      {author.name?.charAt(0).toUpperCase() ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className={styles["author-name-wrapper"]}>
                    <div className={styles["author-name"]}>{author.name}</div>
                    <p>Posted on {format(createdAt, "LLLL do")}</p>
                  </div>
                </div>

                <h3 className={styles["blog-title"]}>{title}</h3>
                <BlogContent desc={desc} />
              </div>
              <div></div>
            </Link>
          )
        }
      )}
    </div>
  )
}

export function BlogContent({ desc }: { desc: { blocks: Block[] } }) {
  const [height, setHeight] = React.useState(0)
  const pRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    setHeight(pRef.current?.clientHeight ?? 0)
  }, [])

  return (
    <div className={styles["blog-content"]} ref={pRef}>
      {desc.blocks.map(({ data, type }, index) => {
        if (type === "linkTool") {
          return <p key={index}>{data?.link}</p>
        }

        return <p key={index}>{data?.text}</p>
      })}
      {height === 160 ? (
        // blur bottom if content is too long
        <div className={styles["blog-desc-blur"]}></div>
      ) : null}
    </div>
  )
}
