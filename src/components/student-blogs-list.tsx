import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import { format } from "date-fns"

import { type BlogWithUser } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/student-blogs-list.module.scss"

interface StudentBlogsListProps {
  facultyId: string
}

export async function StudentBlogsList({ facultyId }: StudentBlogsListProps) {
  const blogs = (await db.blogs.findMany({
    where: { facultyId, publicized: true, status: "APPROVE" },
    include: {
      author: true,
    },
  })) as BlogWithUser[]

  return (
    <>
      {!blogs.length && <div className={styles["no-results"]}>No results</div>}

      {blogs.map(({ id, title, author, createdAt, updatedAt }, index) => (
        <article className={styles["article-wrapper"]} key={index}>
          <div className={styles["article-container"]}>
            <div className={styles["article-header-wrapper"]}>
              <div className={styles["author-avatar-wrapper"]}>
                <Avatar className={styles["avatar"]}>
                  <AvatarImage
                    src={author.image ?? ""}
                    alt={""}
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                  />
                  <AvatarFallback>
                    <Icons.user />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className={styles["author-name"]}>{author.name}</div>
                <div>Created at: {format(createdAt, "PPP")}</div>
                <div>Updated at: {format(updatedAt, "PPP")}</div>
              </div>
            </div>
            <div className={styles["article-content-wrapper"]}>
              <h3 className={styles["article-title"]}>
                <Link
                  href={`/faculty/blog/${id}`}
                  className={styles["article-link"]}
                >
                  {title}
                </Link>
              </h3>
              <p className={styles["article-description"]}>-</p>
              <div className={styles["article-comments-wrapper"]}>
                <Button variant={"ghost"} className={styles["comment-btn"]}>
                  <Icons.messageCircle />
                  69 comments
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </>
  )
}
