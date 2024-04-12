import * as React from "react"
import Link from "next/link"
import { type StatusEnum } from "@prisma/client"
import { format } from "date-fns"

import {
  getBlogCountByMarketingManager,
  getBlogsWithUserByMarketingManager,
} from "@/lib/fetchers/blog"
import type { BlogWithUser } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { PaginationGroupList } from "@/components/pagination-group-list"
import styles from "@/styles/components/marketing-manager-blog-list.module.scss"

interface MarketingManagerBlogListProps {
  page: number
  rows: number
  status: StatusEnum
  academicYearId: string
}

export async function MarketingManagerBlogList({
  page,
  rows,
  status,
  academicYearId,
}: MarketingManagerBlogListProps) {
  const blogs = (await getBlogsWithUserByMarketingManager({
    pageNumber: page,
    rowsNumber: rows,
    status,
    academicYearId,
  })) as BlogWithUser[]

  const totalBlogs = (await getBlogCountByMarketingManager(
    academicYearId,
    status
  )) as number

  if (!blogs?.length) {
    return <div className={styles["no-results"]}>No results</div>
  }

  return (
    <div>
      <div>
        {blogs.map(
          (
            { id, title, author, createdAt, updatedAt, status, comments },
            index
          ) => (
            <article className={styles["article-wrapper"]} key={index}>
              <div className={styles["article-container"]}>
                <div className={styles["article-header-wrapper"]}>
                  <div className={styles["article-header-container"]}>
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
                  <div className={styles["status-wrapper"]}>
                    <div
                      className={styles["upload-status"]}
                      data-submit={status.toLowerCase()}
                    >
                      {status.toLowerCase()}
                    </div>
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
                      {
                        comments.filter((comment) => !comment.replyToId).length
                      }{" "}
                      comments
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      <PaginationGroupList
        page={page}
        rows={rows}
        status={status}
        totalBlogs={totalBlogs}
      />
    </div>
  )
}
