import * as React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import type { EditorState } from "lexical"

export function OnChangePlugin({
  onChange,
}: {
  onChange: (value: EditorState) => void
}) {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState)
    })
  }, [editor, onChange])

  return null
}
