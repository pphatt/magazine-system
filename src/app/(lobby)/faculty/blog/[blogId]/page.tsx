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
import type { BlogWithInclude } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BlogSubmissionGrading } from "@/components/blog-submission-grading"
import { CommentsSection } from "@/components/comments-section"
import { Icons } from "@/components/icons"
import { RenderBlog } from "@/components/render-blog"
import styles from "@/styles/(blog)/page.module.scss"

const DownloadZip = dynamic(() => import("@/components/download-zip"), {
  ssr: false,
})

export default async function BlogPage({
  params,
}: {
  params: { blogId: string }
}) {
  const { blogId } = params

  const blog = (await db.blogs.findUnique({
    where: { id: blogId },
    include: {
      author: true,
      faculty: true,
      academicYear: true,
    },
  })) as BlogWithInclude

  if (!blog || blog.faculty.status === "SUSPENDED") {
    redirect("/faculty")
  }

  const user = (await currentUser()) as User

  if (user.role === "STUDENT") {
    if (blog.authorId !== user.id && blog.status !== "APPROVE") {
      redirect("/faculty")
    }
  }

  if (user.role === "GUEST" && !blog.publicized) {
    redirect("/faculty")
  }

  const content = blog.content as { blocks: Block[] }

  return (
    <div className={styles["blog-wrapper"]}>
      <article className={styles["blog-content-wrapper"]}>
        <header className={styles["blog-header-wrapper"]}>
          {blog.backgroundImage && (
            <div className={styles["background-image-wrapper"]}>
              <img
                src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/${blog.backgroundImage}`}
                alt={""}
                className={styles["background-image"]}
              />
            </div>
          )}
          <div className={styles["blog-header"]}>
            <div className={styles["blog-author-wrapper"]}>
              <div className={styles["blog-author-container"]}>
                <Avatar className={styles["avatar"]}>
                  <AvatarImage
                    src={blog.author.image ?? ""}
                    alt={""}
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                  />
                  <AvatarFallback>
                    {blog.author.name?.charAt(0).toUpperCase() ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className={styles["author-name-wrapper"]}>
                  <div className={styles["author-name"]}>
                    {blog.author.name}
                  </div>
                  <p>Posted on {format(blog.createdAt, "LLLL do")}</p>
                </div>
              </div>
            </div>
            <h1 className={styles["blog-title"]}>{blog.title ?? "-"}</h1>
            <div className={styles["blog-extra"]}>
              <div className={styles["extra-layout"]}>
                Faculty: {blog.faculty.name ?? "-"}
              </div>
              <div className={styles["extra-layout"]}>
                Academic Year: {blog.academicYear.name ?? "-"}
              </div>
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
              <DownloadZip name={blog.title} location={blog.location} />
            </div>
            <div className={styles["files"]}>
              {blog.location.map((value) => {
                const _split = value.split("/")
                const name = _split[_split.length - 1] ?? ""

                return (
                  <Link
                    href={`https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contributions/${value}`}
                    className={styles["file"]}
                  >
                    <Icons.fileDownload />
                    <span>{name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <CommentsSection blogId={blog.id} />
      </article>
      <div className={styles["blog-detail-wrapper"]}>
        <div className={styles["blog-detail"]}>
          <div>
            Blog status:{" "}
            <span data-submit={blog.status.toLowerCase()}>
              {blog.status.toLowerCase()}
            </span>
          </div>
          <div>
            Faculty: <strong>{blog.faculty.name ?? "-"}</strong>
          </div>
          <div>
            Academic Year: <strong>{blog.academicYear.name}</strong>
          </div>
        </div>
        {user.role === "MARKETING_COORDINATOR" && blog.status === "PENDING" && (
          <div className={styles["blog-detail"]}>
            <div>Blog grading</div>
            {blog.status.toLowerCase() === "pending" && (
              <BlogSubmissionGrading blogId={blog.id} status={blog.status} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
