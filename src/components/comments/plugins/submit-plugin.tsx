import * as React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getRoot, type SerializedElementNode } from "lexical"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/comments/comments-input.module.scss"

export const SubmitPlugin = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (callback: () => void) => void
  isPending: boolean
}) => {
  const [editor] = useLexicalComposerContext()
  const editorStateJSON = editor.toJSON()
  const rootChildren = editorStateJSON.editorState.root
    .children as SerializedElementNode[]

  const handleClearEditor = React.useCallback(() => {
    onSubmit(() => {
      editor.update(() => {
        const root = $getRoot()
        root.clear()
      })
    })
  }, [editor, onSubmit])

  return (
    <div className={styles["post-btn"]}>
      <Button
        type="submit"
        disabled={
          isPending ||
          (rootChildren.length <= 1 && rootChildren[0]?.children?.length === 0)
        }
        className={styles["submit-btn"]}
        onClick={handleClearEditor}
      >
        {isPending && (
          <Icons.spinner className={styles["icon"]} aria-hidden="true" />
        )}
        <span>Post</span>
      </Button>
    </div>
  )
}
