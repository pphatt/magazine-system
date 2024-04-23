"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { type EditorState } from "lexical"
import { toast } from "sonner"
import type { z } from "zod"

import { commentOnBlog } from "@/lib/actions/contribution"
import type { commentSchema } from "@/lib/validations/comment"
import { OnChangePlugin } from "@/components/comments/plugins/onchange-plugin"
import { SubmitPlugin } from "@/components/comments/plugins/submit-plugin"
import ToolbarPlugin from "@/components/comments/plugins/toolbar-plugin"
import Theme from "@/components/comments/theme"
import styles from "@/styles/components/comments/comments-input.module.scss"

function Placeholder() {
  return (
    <div className={styles["editor-placeholder"]}>Add to the discussion</div>
  )
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
  editorState: `{
    "root": {
      "children": [{
        "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1
      }], "direction": null, "format": "", "indent": 0, "type": "root", "version": 1
    }
  }`,
}

interface CommentsInputProps {
  blogId: string
  replyToId?: string
}

export type CommentInputs = z.infer<typeof commentSchema>

export default function CommentsInput({
  blogId,
  replyToId,
}: CommentsInputProps) {
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
          contributionId: blogId,
          replyToId,
          text: editorState,
        })

        if ("success" in req) {
          router.refresh()
          callback()
        } else {
          toast.error(req.error)
        }
      } catch (e) {
        toast.error("Something went wrong. Try again!")
      }
    })
  }

  return (
    <div className={styles["comment-wrapper"]}>
      <LexicalComposer initialConfig={editorConfig}>
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
            <OnChangePlugin onChange={onChange} />
          </div>
        </div>
        <SubmitPlugin isPending={isPending} onSubmit={onSubmit} />
      </LexicalComposer>
    </div>
  )
}
