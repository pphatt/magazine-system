import { env } from "@/env"
import { db } from "@/server/db"
import { transporter } from "@/server/node-mailer/node-mailer"
import { supabase } from "@/server/supabase/supabase"
import { render } from "@react-email/components"
import { format } from "date-fns"
import { v4 } from "uuid"
import { z } from "zod"

import { currentUser } from "@/lib/auth/auth"
import type { uploadBlogSchema } from "@/lib/validations/blog"
import { GradingBlogEmail } from "@/components/emails/grading-blog-email"
import { SubmitBlogEmail } from "@/components/emails/submit-blog-email"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { title, content, facultyId, academicYearId } = JSON.parse(
      formData.get("data") as string
    ) as z.infer<typeof uploadBlogSchema>

    const user = await currentUser()

    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const files = formData.getAll("files[]") as File[] | null

    if (!files) {
      return new Response(JSON.stringify("No submit files were recorded"), {
        status: 400,
      })
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

    // const mc = (await db.user.findFirst({
    //   where: { facultyId, role: "MARKETING_COORDINATOR" },
    // })) as User

    // one email for student who submit the blog
    // await resend.emails.send({
    //   from: "noreply <onboarding@mangado.org>",
    //   to: [user.email!],
    //   subject: "You have submitted",
    //   html: `<strong>yea</strong>`,
    // })

    // one email for marketing coordinator who will grading the blog
    // const reqEmail = await resend.emails.send({
    //   from: "Do not reply to this email <magazine@mangado.org>",
    //   to: ["phatvu.080903@gmail.com"],
    //   subject: "You have submitted",
    //   html: `<strong>You have submitted successfully <a href="${env.NODE_ENV === "development" ? "http://localhost:3000" : ""}/contribution/blog/${id}">Blog link</a></strong>`,
    // })

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
        email: "phatvu080903@gmail.com",
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
      to: "phatvu080903@gmail.com",
      html: marketingCoordinatorEmailHtml,
    })

    return new Response(JSON.stringify({ blogId: id }), { status: 200 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.message), { status: 400 })
    }

    return new Response(
      JSON.stringify("Could not upload blog at this time. Please try later"),
      { status: 500 }
    )
  }
}
