"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { saveBlog } from "@/lib/actions/blog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/save-blog.module.scss"

interface SaveBlogProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  blogId: string
  initialSave: boolean
}

export function SaveBlog({
  blogId,
  initialSave,
  className,
  children,
  ...props
}: SaveBlogProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const payload = {
          blogId,
        }

        const req = await saveBlog(payload)

        if ("success" in req) {
          router.refresh()
          toast.success(req.success)
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  return (
    <Button
      {...props}
      className={cn(className ?? styles["save-blog-btn"], {
        [`${styles["current-save-blog"]}`]: initialSave,
      })}
      onClick={onSubmit}
      disabled={isPending}
    >
      <Icons.bookmark />
      {children}
    </Button>
  )
}
