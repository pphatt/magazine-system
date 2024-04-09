import * as React from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { env } from "@/env"
import { db } from "@/server/db"
import type { Block } from "@/types"
import { format } from "date-fns"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import type { BlogWithInclude } from "@/lib/prisma"
import styles from "@/styles/(lobby)/faculty/blog/edit/page.module.scss"

const EditBlogEditor = dynamic(
  () => import("@/components/editor/edit-blog-editor"),
  { ssr: false }
)

export default async function EditBlogPage({
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
    redirect("/faculty")
  }

  const user = (await currentUser()) as User

  if (blog.authorId !== user.id || blog.status !== "PENDING") {
    redirect("/faculty")
  }

  const content = blog.content as { blocks: Block[] }

  return (
    <div className={styles["layout"]}>
      <div className={styles["inner-layout"]}>
        <div className={styles["header-wrapper"]}>
          <h1>{blog.title}</h1>
        </div>

        <div className={styles["info-wrapper"]}>
          <div className={styles["faculty-detail-wrapper"]}>
            <div className={styles["faculty-detail-container"]}>
              <h3>
                Faculty: <span>{blog.faculty.name}</span>
              </h3>
            </div>
          </div>

          <div className={styles["faculty-detail-wrapper"]}>
            <div className={styles["faculty-detail-container"]}>
              <h3>
                Academic Year: <span>{blog.academicYear.name}</span>
              </h3>
              <p>
                Start Date:{" "}
                <span>{format(blog.academicYear.startDate, "PPP")}</span>
              </p>
              <p>
                Closure Date:{" "}
                <span>{format(blog.academicYear.closureDate, "PPP")}</span>
              </p>
            </div>
          </div>
        </div>

        <Suspense>
          <EditBlogEditor
            blogId={blogId}
            title={blog.title}
            content={content.blocks}
            prevFiles={blog.location}
            facultyId={blog.facultyId}
            academicYearId={blog.academicYearId}
            backgroundImage={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/${blog.backgroundImage}`}
          />
        </Suspense>
      </div>
    </div>
  )
}
