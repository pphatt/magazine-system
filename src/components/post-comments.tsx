"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import type { Comment } from "@prisma/client"
import type { EditorState } from "lexical"
import { MessageSquare } from "lucide-react"
import type { User } from "next-auth"
import { toast } from "sonner"

import { commentOnBlog } from "@/lib/actions/blog"
import { formatTimeToNow } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { OnChangePlugin } from "@/components/comments/plugins/onchange-plugin"
import { SubmitReplyPlugin } from "@/components/comments/plugins/submit-reply-plugin"
import ToolbarPlugin from "@/components/comments/plugins/toolbar-plugin"
import { RenderComment } from "@/components/comments/render-comment"
import Theme from "@/components/comments/theme"
import styles from "@/styles/components/post-comments.module.scss"

function Placeholder() {
  return <div className={styles["editor-placeholder"]}>Reply...</div>
}

const editorConfig = {
  namespace: "Blog comment",
  nodes: [],
  // Handling of errors during update
  onError(error: Error) {
    throw error
  },
  // The editor theme
  theme: Theme,
}

type ExtendedComment = Comment & {
  author: User
}

interface PostCommentsProps {
  comment: ExtendedComment
  blogId: string
}

export function PostComments({ comment, blogId }: PostCommentsProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false)
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const [editorState, setEditorState] = React.useState<string>("")

  const onChange = React.useCallback((editorState: EditorState) => {
    const editorStateJSON = editorState.toJSON()
    setEditorState(JSON.stringify(editorStateJSON))
  }, [])

  function onSubmit(callback: () => void) {
    startTransition(async () => {
      try {
        const req = await commentOnBlog({
          blogId,
          replyToId: comment.replyToId ?? comment.id,
          text: editorState,
        })

        if ("success" in req) {
          router.refresh()
          setIsReplying(false)
          callback()
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast("Something went wrong. Try again!")
      }
    })
  }

  return (
    <div className={styles["comment-wrapper"]}>
      <div className={styles["comment-header"]}>
        <Avatar className={styles["avatar"]}>
          <AvatarImage
            src={comment.author?.image as string | undefined}
            alt={""}
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
          <AvatarFallback>
            {comment.author.name?.charAt(0) ?? ""}
          </AvatarFallback>
        </Avatar>
        <div className={styles["author-details"]}>
          <p className={styles["author-name"]}>{comment.author.name}</p>

          <p className={styles["comment-created-at"]}>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <RenderComment text={comment.text} />

      {!isReplying && (
        <div className={styles["reply-wrapper"]}>
          <Button
            onClick={() => {
              setIsReplying(true)
            }}
            className={styles["reply-to-btn"]}
            variant={"ghost"}
          >
            <MessageSquare />
            Reply
          </Button>
        </div>
      )}

      {isReplying ? (
        <div className={styles["reply-section"]}>
          <LexicalComposer
            initialConfig={{
              ...editorConfig,
              editorState: `{
                "root": {
                  "children": [{
                    "children": [{
                      "detail":0,
                      "format":1,
                      "mode":"normal",
                      "style":"",
                      "text":"@${comment.author.name} ",
                      "type":"text",
                      "version":1
                    }], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1
                  }], "direction": null, "format": "", "indent": 0, "type": "root", "version": 1
                }
              }`,
            }}
          >
            <div className={styles["editor-container"]}>
              <ToolbarPlugin />
              <div className={styles["editor-inner"]}>
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className={styles["editor-input"]} />
                  }
                  placeholder={<Placeholder />}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <ClearEditorPlugin />
                <AutoFocusPlugin />
                <OnChangePlugin onChange={onChange} />
              </div>
            </div>
            <SubmitReplyPlugin
              isPending={isPending}
              onSubmit={onSubmit}
              setIsReplying={setIsReplying}
            />
          </LexicalComposer>
        </div>
      ) : null}
    </div>
  )
}
