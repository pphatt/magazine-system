import * as React from "react"
import Link from "next/link"
import { type StatusEnum } from "@prisma/client"
import { format } from "date-fns"
import type { User } from "next-auth"

import {
  getContributionCountByMarketingManager,
  getContributionsWithUserByMarketingManager,
} from "@/lib/fetchers/contribution"
import type { ContributionWithUser } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { LikeBtn } from "@/components/like-btn"
import { PaginationManager } from "@/components/pagination/pagination-blog-manager"
import { SaveBlog } from "@/components/save-blog"
import styles from "@/styles/components/marketing-manager-blog-list.module.scss"

interface MarketingManagerBlogListProps {
  user: User
  query: string
  page: number
  rows: number
  status: StatusEnum
  academicYearId: string
  facultyId: string
}

export async function MarketingManagerBlogList({
  user,
  query,
  page,
  rows,
  status,
  academicYearId,
  facultyId,
}: MarketingManagerBlogListProps) {
  const contributions = (await getContributionsWithUserByMarketingManager({
    query,
    pageNumber: page,
    rowsNumber: rows,
    status,
    academicYearId,
    facultyId,
  })) as ContributionWithUser[]

  const totalContributions = (await getContributionCountByMarketingManager(
    query,
    facultyId,
    academicYearId,
    status
  )) as number

  if (!contributions?.length) {
    return <div className={styles["no-results"]}>No results</div>
  }

  return (
    <div>
      <div>
        {contributions.map(
          (
            {
              id,
              title,
              author,
              createdAt,
              status,
              comments,
              marketingCoordinator,
              like,
              save,
              allowGuest,
            },
            index
          ) => {
            const commentsCount = comments.filter(
              (comment) => !comment.replyToId
            ).length

            const initialLike = like.some(
              ({ userId, contributionId }) =>
                userId === user.id && contributionId === id
            )

            const initialSave = save.some(
              ({ userId, contributionId }) =>
                userId === user.id && contributionId === id
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
                        <div className={styles["author-name"]}>
                          {author.name}
                        </div>
                        <div>Created at: {format(createdAt, "PPP")}</div>
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
                    <div className={styles["article-description"]}>
                      Guest permission:
                      <div
                        className={styles["guest-permission"]}
                        data-permission={allowGuest}
                      >
                        {allowGuest ? "Allowed" : "Not allowed"}
                      </div>
                    </div>
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

                      <SaveBlog
                        blogId={id}
                        initialSave={initialSave}
                        className={styles["save-btn"]}
                      >
                        <span>Save blog</span>
                      </SaveBlog>

                      <Button
                        variant={"ghost"}
                        className={styles["comment-btn"]}
                      >
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
      </div>

      <PaginationManager
        query={query}
        page={page}
        rows={rows}
        facultyId={facultyId}
        academicYearId={academicYearId}
        status={status}
        totalBlogs={totalContributions}
      />
    </div>
  )
}
