import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import type { User } from "next-auth"

import {
  getBlogCountByGuest,
  getBlogsWithUserByGuest,
} from "@/lib/fetchers/blog"
import { type BlogWithUser } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { LikeBtn } from "@/components/like-btn"
import { PaginationBlogGuest } from "@/components/pagination/pagination-blog-guest"
import styles from "@/styles/components/student-blogs-list.module.scss"

interface StudentBlogsListProps {
  user: User
  query: string
  page: number
  rows: number
}

export async function GuestBlogsList({
  user,
  query,
  page,
  rows,
}: StudentBlogsListProps) {
  const blogs = (await getBlogsWithUserByGuest({
    query,
    pageNumber: page,
    rowsNumber: rows,
  })) as BlogWithUser[]

  const totalBlogs = (await getBlogCountByGuest(query)) as number

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
            comments,
            marketingCoordinator,
            like,
          },
          index
        ) => {
          const commentsCount = comments.filter(
            (comment) => !comment.replyToId
          ).length

          const initialLike = like.some(
            ({ userId, blogId }) => userId === user.id && blogId === id
          )

          return (
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
                    <div className={styles["upload-status"]}>Published</div>
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
                    <LikeBtn
                      blogId={id}
                      likeCount={like.length}
                      initialLike={initialLike}
                      className={styles["like-btn"]}
                    >
                      <span>
                        {like.length} {like.length > 1 ? "likes" : "like"}
                      </span>
                    </LikeBtn>

                    <Button variant={"ghost"} className={styles["comment-btn"]}>
                      <Icons.messageCircle />
                      <span>
                        {commentsCount}{" "}
                        {commentsCount > 1 ? "comments" : "comment"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        }
      )}

      <PaginationBlogGuest
        query={query}
        page={page}
        rows={rows}
        totalBlogs={totalBlogs}
      />
    </div>
  )
}
