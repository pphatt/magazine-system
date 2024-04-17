import * as React from "react"
import Link from "next/link"
import { type StatusEnum } from "@prisma/client"
import { format } from "date-fns"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { getBlogCount, getBlogsWithUser } from "@/lib/fetchers/blog"
import type { BlogWithUser } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { PaginationMarketingCoor } from "@/components/pagination/pagination-marketing-coor"
import { StudentSubmissionGrading } from "@/components/student-submission-grading"
import styles from "@/styles/components/marketing-coor-blogs-list.module.scss"

interface MarketingCoorBlogsListProps {
  query: string
  page: number
  rows: number
  status: StatusEnum
  facultyId: string
  academicYearId: string
}

export async function MarketingCoorBlogsList({
  query,
  page,
  rows,
  status,
  facultyId,
  academicYearId,
}: MarketingCoorBlogsListProps) {
  const blogs = (await getBlogsWithUser({
    query,
    pageNumber: page,
    rowsNumber: rows,
    status,
    facultyId,
    academicYearId,
  })) as BlogWithUser[]

  const totalBlogs = (await getBlogCount(
    query,
    academicYearId,
    status
  )) as number

  const user = (await currentUser()) as User

  if (!blogs?.length) {
    return <div className={styles["no-results"]}>No results</div>
  }

  return (
    <div>
      {blogs.map(
        (
          {
            id,
            title,
            author,
            createdAt,
            updatedAt,
            status,
            comments,
            marketingCoordinator,
          },
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
                <p className={styles["article-description"]}>
                  {marketingCoordinator?.name
                    ? `Graded by: ${marketingCoordinator?.name}`
                    : "Not graded yet"}
                </p>
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
              {status.toLowerCase() === "pending" && (
                <StudentSubmissionGrading
                  user={user}
                  blogId={id}
                  status={status}
                />
              )}
            </div>
          </article>
        )
      )}

      <PaginationMarketingCoor
        query={query}
        page={page}
        rows={rows}
        academicYearId={academicYearId}
        status={status}
        totalBlogs={totalBlogs}
      />
    </div>
  )
}
