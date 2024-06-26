import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { redirect } from "next/navigation"
import { env } from "@/env"
import { db } from "@/server/db"
import type { Block } from "@/types"
import { format } from "date-fns"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import type { ContributionWithUserWithInclude } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BlogSubmissionGrading } from "@/components/blog-submission-grading"
import { CommentsSection } from "@/components/comments-section"
import { Icons } from "@/components/icons"
import { LikeBtn } from "@/components/like-btn"
import { RenderBlog } from "@/components/render-blog"
import { SaveBlog } from "@/components/save-blog"
import { ViewFile } from "@/components/view-file"
import styles from "@/styles/(blog)/page.module.scss"
import { ActionGroupButton } from "@/app/(lobby)/contribution/blog/[blogId]/_components/action-group-btn"
import { AllowGuest } from "@/app/(lobby)/contribution/blog/[blogId]/_components/allow-guest"
import {DeleteContribution} from "@/components/delete-contribution";

const DownloadZip = dynamic(() => import("@/components/download-zip"), {
  ssr: false,
})

export default async function BlogPage({
  params,
}: {
  params: { blogId: string }
}) {
  const { blogId } = params

  const contribution = (await db.contributions.findUnique({
    where: { id: blogId },
    include: {
      author: true,
      faculty: true,
      academicYear: true,
      like: true,
      save: true,
    },
  })) as ContributionWithUserWithInclude

  if (!contribution) {
    redirect("/contribution")
  }

  const user = (await currentUser()) as User

  // check if the faculty and academic of the blog is suspense or not
  // the author allow viewing it in recent blog even though the academic year or faculty is still suspense
  if (
    (contribution.faculty.status === "SUSPENDED" ||
      contribution.academicYear.status === "SUSPENDED") &&
    contribution.authorId !== user.id
  ) {
    redirect("/contribution")
  }

  if (user.role === "STUDENT") {
    if (
      contribution.authorId !== user.id &&
      contribution.status !== "APPROVE"
    ) {
      redirect("/contribution")
    }
  }

  if (user.role === "GUEST" && !contribution.allowGuest) {
    redirect("/contribution")
  }

  const content = contribution.content as { blocks: Block[] }

  const showBlogDetails =
    user.id === contribution.authorId ||
    (user.role !== "STUDENT" && user.role !== "GUEST")

  const initialLike = contribution.like.some(
    ({ userId, contributionId }) =>
      userId === user.id && contributionId === contribution.id
  )

  const initialSave = contribution.save.some(
    ({ userId, contributionId }) =>
      userId === user.id && contributionId === contribution.id
  )

  return (
    <div className={styles["blog-wrapper"]}>
      <div className={styles["action-group-wrapper"]}>
        <div className={styles["action-group-container"]}>
          <LikeBtn
            blogId={contribution.id}
            likeCount={contribution.like.length}
            initialLike={initialLike}
          />

          <SaveBlog blogId={contribution.id} initialSave={initialSave} />

          <ActionGroupButton />
        </div>
      </div>

      <article className={styles["blog-content-wrapper"]}>
        <header className={styles["blog-header-wrapper"]}>
          {contribution.backgroundImage && (
            <div className={styles["background-image-wrapper"]}>
              <img
                src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/${contribution.backgroundImage}`}
                alt={""}
                className={styles["background-image"]}
              />
            </div>
          )}
          <div className={styles["blog-header"]}>
            <div className={styles["blog-author-wrapper"]}>
              <div className={styles["blog-author-container"]}>
                <div className={styles["blog-author-details"]}>
                  <Avatar className={styles["avatar"]}>
                    <AvatarImage
                      src={contribution.author.image ?? ""}
                      alt={""}
                      style={{
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                    <AvatarFallback>
                      {contribution.author.name?.charAt(0).toUpperCase() ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className={styles["author-name-wrapper"]}>
                    <div className={styles["author-name"]}>
                      {contribution.author.name}
                    </div>
                    <p>Posted on {format(contribution.createdAt, "LLLL do")}</p>
                  </div>
                </div>
                {contribution.status === "PENDING" &&
                  contribution.authorId === user.id && (
                    <div className={styles["manage-blog-wrapper"]}>
                      <Button asChild variant={"ghost"}>
                        <Link href={`/contribution/blog/${blogId}/edit`}>
                          Edit
                        </Link>
                      </Button>

                      <DeleteContribution contributionId={blogId} />
                    </div>
                  )}
              </div>
            </div>
            <h1 className={styles["blog-title"]}>
              {contribution.title ?? "-"}
            </h1>
            <div className={styles["blog-extra"]}>
              <div className={styles["extra-layout"]}>
                Faculty: {contribution.faculty.name ?? "-"}
              </div>
              <div className={styles["extra-layout"]}>
                Academic Year: {contribution.academicYear.name ?? "-"}
              </div>
              {showBlogDetails && (
                <>
                  <div
                    className={styles["blog-status"]}
                    data-status={contribution.status.toLowerCase()}
                  >
                    {contribution.status}
                  </div>
                </>
              )}
              {user.role !== "STUDENT" && user.role !== "GUEST" && (
                <div
                  className={styles["guest-permission"]}
                  data-permission={contribution.allowGuest}
                >
                  {contribution.allowGuest ? "Allow Guest" : "Not allow Guest"}
                </div>
              )}
            </div>
          </div>
        </header>
        <div className={styles["content-wrapper"]}>
          <div className={styles["content-blocks"]}>
            <RenderBlog content={content.blocks} />
          </div>
          <div className={styles["file-upload-wrapper"]}>
            <h3>File upload</h3>
            <div className={styles["files"]}>
              {contribution.location.map((value) => {
                const _split = value.split("/")
                const name = _split[_split.length - 1] ?? ""

                return (
                  <div className={styles["file-wrapper"]}>
                    <Link
                      href={`https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contributions/${value}`}
                      download={true}
                      className={styles["file"]}
                    >
                      <Icons.fileDownload />
                      <span>{name}</span>
                    </Link>

                    <ViewFile
                      name={name}
                      url={`https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contributions/${value}`}
                    />
                  </div>
                )
              })}
            </div>
            <div className={styles["files"]}>
              <DownloadZip
                name={contribution.title}
                location={contribution.location}
              />
            </div>
          </div>
        </div>

        <CommentsSection blogId={contribution.id} />
      </article>

      {user.role === "MARKETING_COORDINATOR" &&
        contribution.status === "PENDING" && (
          <div className={styles["blog-detail"]}>
            <BlogSubmissionGrading
              user={user}
              contributionId={contribution.id}
              status={contribution.status}
            />
          </div>
        )}

      {user.role === "MARKETING_COORDINATOR" &&
        contribution.status === "APPROVE" && (
          <div className={styles["blog-detail"]}>
            <AllowGuest
              contributionId={contribution.id}
              status={contribution.allowGuest!}
            />
          </div>
        )}
    </div>
  )
}
