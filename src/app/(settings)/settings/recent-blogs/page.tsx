import * as React from "react"
import Link from "next/link"
import type { SearchParams } from "@/types"
import type { StatusEnum } from "@prisma/client"
import { format } from "date-fns"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { getRecentBlogCount, getRecentBlogs } from "@/lib/fetchers/blog"
import type { BlogWithUser } from "@/lib/prisma"
import { parserPage, parserRows } from "@/lib/utils"
import { recentBlogParamsSchema } from "@/lib/validations/params"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { PaginationGroupList } from "@/components/pagination-group-list"
import styles from "@/styles/(settings)/recent-blogs/page.module.scss"

interface SearchPageProps {
  searchParams: SearchParams
}

export default async function RecentBlogsPage({
  searchParams,
}: SearchPageProps) {
  const user = (await currentUser()) as User

  const { status, page, row } = recentBlogParamsSchema.parse(searchParams)

  const pageNumber = parserPage(page)
  const rowsNumber = parserRows(row, 10)

  const blogs = (await getRecentBlogs({
    userId: user.id!,
    pageNumber,
    rowsNumber,
    status: status,
  })) as BlogWithUser[]

  const totalBlogs = (await getRecentBlogCount(
    user.id!,
    status.toLowerCase() as StatusEnum
  )) as number

  if (!blogs?.length) {
    return <div className={styles["no-results"]}>No results</div>
  }

  return (
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
                    href={`/contribution/blog/${id}`}
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

      <PaginationGroupList
        page={pageNumber}
        rows={rowsNumber}
        status={status}
        totalBlogs={totalBlogs}
      />
    </div>
  )
}
