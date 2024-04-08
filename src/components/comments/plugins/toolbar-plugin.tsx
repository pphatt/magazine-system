"use client"

import * as React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/comments/plugins/toolbar-plugin.module.scss"

const LowPriority = 1

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = React.useRef(null)
  const [isBold, setIsBold] = React.useState(false)
  const [isItalic, setIsItalic] = React.useState(false)
  const [isUnderline, setIsUnderline] = React.useState(false)
  const [isStrikethrough, setIsStrikethrough] = React.useState(false)

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
    }
  }, [])

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload) => {
          updateToolbar()
          return false
        },
        LowPriority
      )
    )
  }, [editor, updateToolbar])

  return (
    <div className={styles["toolbar"]} ref={toolbarRef}>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }}
        className={cn(styles["toolbar-item"], {
          [`${styles["toolbar-item-active"]}`]: isBold,
        })}
        aria-label="Format Bold"
      >
        <Icons.bold className={styles["toolbar-svg"]} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }}
        className={cn(styles["toolbar-item"], {
          [`${styles["toolbar-item-active"]}`]: isItalic,
        })}
        aria-label="Format Italics"
      >
        <Icons.italic className={styles["toolbar-svg"]} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }}
        className={cn(styles["toolbar-item"], {
          [`${styles["toolbar-item-active"]}`]: isUnderline,
        })}
        aria-label="Format Underline"
      >
        <Icons.underline className={styles["toolbar-svg"]} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }}
        className={cn(styles["toolbar-item"], {
          [`${styles["toolbar-item-active"]}`]: isStrikethrough,
        })}
        aria-label="Format Strikethrough"
      >
        <Icons.strikethrough className={styles["toolbar-svg"]} />
      </button>
    </div>
  )
}
