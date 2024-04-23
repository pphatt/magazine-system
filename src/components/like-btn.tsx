"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { likeBlog } from "@/lib/actions/contribution"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/like-btn.module.scss"

interface LikeBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  blogId: string
  likeCount: number
  initialLike: boolean
}

export function LikeBtn({
  blogId,
  likeCount,
  initialLike,
  className,
  children,
  ...props
}: LikeBtnProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onSubmit = () => {
    startTransition(async () => {
      try {
        const payload = {
          contributionId: blogId,
        }

        const req = await likeBlog(payload)

        if ("success" in req) {
          router.refresh()
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
      className={cn(className ?? styles["like-btn"], {
        [`${styles["current-like"]}`]: initialLike,
      })}
      onClick={onSubmit}
      disabled={isPending}
    >
      <Icons.heart />
      {children ?? <span>{likeCount}</span>}
    </Button>
  )
}
