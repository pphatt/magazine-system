import * as React from "react"
import { db } from "@/server/db"

import { CreateComment } from "@/components/create-comment"
import styles from "@/styles/components/comments-section.module.scss"

import { PostComments } from "./post-comments"

interface CommentsSectionProps {
  blogId: string
}

export async function CommentsSection({ blogId }: CommentsSectionProps) {
  const comments = await db.comment.findMany({
    where: {
      contributionId: blogId,
      replyToId: null, // only fetch top-level comments
    },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
  })

  return (
    <div className={styles["comment-section-wrapper"]}>
      <header className={styles["header-wrapper"]}>
        <div className={styles["header-text-wrapper"]}>
          <h2>
            Comments ({comments.filter((comment) => !comment.replyToId).length})
          </h2>
        </div>
      </header>
      <div className={styles["comment-section"]}>
        <CreateComment blogId={blogId} />

        <div className={styles["comments-section"]}>
          {comments
            .filter((comment) => !comment.replyToId)
            .map((topLevelComment) => {
              return (
                <div
                  key={topLevelComment.id}
                  className={styles["comment-wrapper"]}
                >
                  <div className={styles["top-comment-wrapper"]}>
                    <PostComments comment={topLevelComment} blogId={blogId} />

                    {/* Render replies */}
                    {topLevelComment.replies.map((reply) => {
                      return (
                        <div
                          key={reply.id}
                          className={styles["reply-comment-wrapper"]}
                        >
                          <PostComments comment={reply} blogId={blogId} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
