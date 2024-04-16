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
import { Button } from "@/components/ui/button"
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

  if (!blog) {
    redirect("/contribution")
  }

  const user = (await currentUser()) as User

  // check if the faculty and academic of the blog is suspense or not
  // the author allow viewing it in recent blog even though the academic year or faculty is still suspense
  if (
    (blog.faculty.status === "SUSPENDED" ||
      blog.academicYear.status === "SUSPENDED") &&
    blog.authorId !== user.id
  ) {
    redirect("/contribution")
  }

  if (user.role === "STUDENT") {
    if (blog.authorId !== user.id && blog.status !== "APPROVE") {
      redirect("/contribution")
    }
  }

  if (user.role === "GUEST" && !blog.publicized) {
    redirect("/contribution")
  }

  const content = blog.content as { blocks: Block[] }

  const showBlogStatus = (user.id === blog.authorId || (user.role !== "STUDENT" && user.role !== "GUEST"))

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
                <div className={styles["blog-author-details"]}>
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
                {blog.status === "PENDING" && blog.authorId === user.id && (
                  <div className={styles["manage-blog-wrapper"]}>
                    <Button asChild variant={"ghost"}>
                      <Link href={`/contribution/blog/${blogId}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant={"ghost"}>
                      <Link href={`/contribution/blog/${blogId}/edit`}>
                        Delete
                      </Link>
                    </Button>
                  </div>
                )}
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
              {showBlogStatus && (
                <div className={styles["blog-status"]} data-status={blog.status.toLowerCase()}>
                  {blog.status}
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
              {blog.location.map((value) => {
                const _split = value.split("/")
                const name = _split[_split.length - 1] ?? ""

                return (
                  <Link
                    href={`https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contributions/${value}`}
                    className={styles["file"]}
                    download={true}
                  >
                    <Icons.fileDownload />
                    <span>{name}</span>
                  </Link>
                )
              })}
            </div>
            <div className={styles["files"]}>
              <DownloadZip name={blog.title} location={blog.location} />
            </div>
          </div>
        </div>

        <CommentsSection blogId={blog.id} />
      </article>

      {user.role === "MARKETING_COORDINATOR" && blog.status === "PENDING" && (
        <div className={styles["blog-detail"]}>
          {blog.status.toLowerCase() === "pending" && (
            <BlogSubmissionGrading
              user={user}
              blogId={blog.id}
              status={blog.status}
            />
          )}
        </div>
      )}
    </div>
  )
}
