"use client"

import * as React from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import Theme from "@/components/comments/theme"
import styles from "@/styles/components/comments/render-comment.module.scss"

interface RenderCommentProps {
  text: string
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

export function RenderComment({ text }: RenderCommentProps) {
  return (
    <div className={styles["comment-wrapper"]}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editable: false,
          editorState: text,
        }}
      >
        <div className={styles["editor-container"]}>
          <div className={styles["editor-inner"]}>
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={<></>}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}
