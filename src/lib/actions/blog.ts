"use server"

import { env } from "@/env"
import { db } from "@/server/db"
import { transporter } from "@/server/node-mailer/node-mailer"
import { supabase } from "@/server/supabase/supabase"
import type { StatusEnum, User } from "@prisma/client"
import { render } from "@react-email/components"
import { format } from "date-fns"
import { v4 } from "uuid"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import {
  blogGradingSchema,
  guestPermissionSchema,
  likeBlogSchema,
  type uploadBlogSchema,
  type uploadEditBlogSchema,
} from "@/lib/validations/blog"
import { commentSchema } from "@/lib/validations/comment"
import { GradingBlogEmail } from "@/components/emails/grading-blog-email"
import { GradingBlogStudentNotifyEmail } from "@/components/emails/grading-blog-notify-student-email"
import { SubmitBlogEmail } from "@/components/emails/submit-blog-email"

export const createBlog = async (formData: FormData) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { title, content, facultyId, academicYearId } = JSON.parse(
      formData.get("data") as string
    ) as z.infer<typeof uploadBlogSchema>

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: "Unauthorized" }
    }

    const files = formData.getAll("files[]") as File[] | null

    if (!files) {
      return { error: "No submit files were recorded" }
    }

    const filesUrl: string[] = []

    for (const file of files) {
      const { data } = await supabase.storage
        .from("student-contributions")
        .upload(
          `${facultyId}/${academicYearId}/${user.id}/${v4()}/${file.name}`,
          file
        )

      filesUrl.push(data?.path ?? "")
    }

    const image = formData.get("image") as Blob | null

    let imageUrl: string | null = null

    if (image) {
      const { data } = await supabase.storage
        .from("student-contributions")
        .upload(`${facultyId}/${academicYearId}/${user.id}/${v4()}`, image)

      imageUrl = data?.path ?? ""
    }

    const { id, createdAt } = await db.blogs.create({
      data: {
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        content,
        backgroundImage: imageUrl ?? "",
        facultyId,
        academicYearId,
        authorId: user.id,
        location: filesUrl,
      },
    })

    const mc = (await db.user.findFirst({
      where: { facultyId, role: "MARKETING_COORDINATOR" },
    })) as User

    const faculty = await db.faculty.findUnique({
      where: {
        id: facultyId,
      },
    })

    const academicYear = await db.academicYear.findUnique({
      where: {
        id: academicYearId,
      },
    })

    const marketingCoordinatorDetails = await db.user.findUnique({
      where: {
        email: mc.email ?? "",
      },
    })

    const blogUrl = `${env.NODE_ENV === "development" ? "http://localhost:3000" : ""}/contribution/blog/${id}`

    const studentEmailHtml = render(
      SubmitBlogEmail({
        id,
        title,
        uploadedAt: format(createdAt, "PPP"),
        faculty: faculty?.name ?? "-",
        academicYear: academicYear?.name ?? "-",
        blogUrl,
      })
    )

    const marketingCoordinatorEmailHtml = render(
      GradingBlogEmail({
        title,
        uploadedAt: format(createdAt, "PPP"),
        academicYear: academicYear?.name ?? "-",
        author: marketingCoordinatorDetails!,
        blogUrl,
      })
    )

    await transporter.sendMail({
      from: "Do not reply to this email <magazine@greenwich.magazine.edu>",
      subject: "Submitted blog successfully",
      to: `${user.email}`,
      html: studentEmailHtml,
    })

    await transporter.sendMail({
      from: "Do not reply to this email <magazine@greenwich.magazine.edu>",
      subject: "Grading blog pending",
      to: mc.email ?? "",
      html: marketingCoordinatorEmailHtml,
    })

    return { success: { blogId: id } }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not upload blog at this time. Please try later" }
  }
}

export const editBlog = async (formData: FormData) => {
  try {
    const {
      blogId,
      title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      content,
      facultyId,
      academicYearId,
      prevImage,
      prevFiles,
      newFilesCount,
    } = JSON.parse(formData.get("data") as string) as z.infer<
      typeof uploadEditBlogSchema
    >

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: "Unauthorized" }
    }

    const files = formData.getAll("files[]") as File[] | null

    if (!files) {
      return { error: "No submit files were recorded" }
    }

    let filesUrl: string[] = prevFiles!

    if (newFilesCount > 0) {
      filesUrl = []

      for (const file of files) {
        await supabase.storage.from("student-contributions").remove(prevFiles!)

        const { data } = await supabase.storage
          .from("student-contributions")
          .upload(
            `${facultyId}/${academicYearId}/${user.id}/${v4()}/${file.name}`,
            file
          )

        filesUrl.push(data?.path ?? "")
      }
    }

    const image = formData.get("image") as Blob | null

    let imageUrl = prevImage

    if (image) {
      await supabase.storage.from("student-contributions").remove([prevImage!])

      const { data } = await supabase.storage
        .from("student-contributions")
        .upload(`${facultyId}/${academicYearId}/${user.id}/${v4()}`, image)

      imageUrl = data?.path ?? ""
    }

    const { id } = await db.blogs.update({
      where: {
        id: blogId,
      },
      data: {
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        content,
        backgroundImage: imageUrl ?? "",
        facultyId,
        academicYearId,
        authorId: user.id,
        location: filesUrl,
      },
    })

    return { success: { blogId: id } }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not edit blog at this time. Please try later" }
  }
}

export const deleteBlog = async () => {}

export const gradingBlog = async (
  values: z.infer<typeof blogGradingSchema>
) => {
  try {
    const { blogId, status, marketingCoordinatorId } =
      blogGradingSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "MARKETING_COORDINATOR") {
      return { error: "Unauthorized" }
    }

    const {
      id,
      title,
      status: blogStatus,
      gradedAt,
      authorId,
    } = await db.blogs.update({
      where: { id: blogId },
      data: {
        marketingCoordinatorId,
        publicized: true,
        status: status as StatusEnum,
        gradedAt: new Date(),
      },
    })

    await db.comment.deleteMany({
      where: {
        blogId: id,
      },
    })

    const author = (await db.user.findUnique({
      where: {
        id: authorId,
      },
    })) as User

    const marketingCoordinator = (await db.user.findUnique({
      where: { id: marketingCoordinatorId },
    })) as User

    const blogUrl = `${env.NODE_ENV === "development" ? "http://localhost:3000" : ""}/contribution/blog/${id}`

    const email = render(
      GradingBlogStudentNotifyEmail({
        author,
        marketingCoordinator,
        blog: { title, status: blogStatus, gradedAt: gradedAt ?? new Date() },
        blogUrl,
      })
    )

    await transporter.sendMail({
      from: "Do not reply to this email <magazine@greenwich.magazine.edu>",
      subject: "Your blog has been graded",
      to: `${author.email}`,
      html: email,
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not grading blog at this time. Please try later" }
  }
}

export const commentOnBlog = async (values: z.infer<typeof commentSchema>) => {
  try {
    const { text, blogId, replyToId } = commentSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: "Need to login to comment" }
    }

    await db.comment.create({
      data: {
        text,
        replyToId,
        blogId,
        authorId: user.id,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not comment at this time. Please try later!" }
  }
}

export async function guestPermission(
  values: z.infer<typeof guestPermissionSchema>
) {
  try {
    const { blogId, status } = guestPermissionSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id || user.role !== "MARKETING_COORDINATOR") {
      return { error: "Unauthorized" }
    }

    await db.blogs.update({
      where: {
        id: blogId,
      },
      data: {
        allowGuest: status,
      },
    })

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not allow guest at this time. Please try later" }
  }
}

export async function likeBlog(values: z.infer<typeof likeBlogSchema>) {
  try {
    const { blogId } = likeBlogSchema.parse(values)

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: "Unauthorized" }
    }

    // check if user has already like this blog
    const existingLike = await db.like.findFirst({
      where: {
        userId: user.id,
        blogId,
      },
    })

    if (existingLike) {
      await db.like.delete({
        where: {
          userId_blogId: {
            userId: user.id,
            blogId,
          }
        },
      })
    } else {
      await db.like.create({
        data: {
          userId: user.id,
          blogId,
        },
      })
    }

    return { success: "OK" }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return { error: JSON.stringify(error.message) }
    }

    return { error: "Could not like this blog at this moment. Please try later" }
  }
}
