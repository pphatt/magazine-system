import * as React from "react"
import dynamic from "next/dynamic"
import type { User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "@/styles/components/create-comment.module.scss"

const CommentsInput = dynamic(
  () => import("@/components/comments/comments-input"),
  { ssr: false }
)

interface CreateCommentProps {
  blogId: string
}

export async function CreateComment({ blogId }: CreateCommentProps) {
  const user = (await currentUser()) as User

  return (
    <div className={styles["comment-wrapper"]}>
      <Avatar className={styles["avatar"]}>
        <AvatarImage
          src={user?.image as string | undefined}
          alt={""}
          style={{
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
        <AvatarFallback>{user.name?.charAt(0) ?? ""}</AvatarFallback>
      </Avatar>
      <CommentsInput blogId={blogId} />
    </div>
  )
}
