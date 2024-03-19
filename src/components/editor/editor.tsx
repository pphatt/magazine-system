"use client"

import * as React from "react"
import { supabase } from "@/server/supabase/supabase"
import type EditorJS from "@editorjs/editorjs"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"

import { EditorAttaches } from "@/components/editor/attaches"
import { EditorCode } from "@/components/editor/code"
import { EditorEmbed } from "@/components/editor/embed"
import { EditorHeader } from "@/components/editor/header"
import { EditorImage } from "@/components/editor/image"
import { EditorInlineCode } from "@/components/editor/inline-code"
import { EditorLink } from "@/components/editor/link"
import { EditorList } from "@/components/editor/list"
import { EditorTable } from "@/components/editor/table"
// import type { z } from "zod"

// import { workspaceSchema } from "@/lib/validations/workspace"
import styles from "@/styles/components/editor.module.scss"

// type WorkspaceCreationRequest = z.infer<typeof workspaceSchema>

interface EditorProps {
  workspaceId: string
}

export function Editor({ workspaceId }: EditorProps) {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<WorkspaceCreationRequest>({
  //   resolver: zodResolver(workspaceSchema),
  //   defaultValues: {
  //     title: "",
  //     content: null,
  //   },
  // })

  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const ref = React.useRef<EditorJS>()

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    // const Header = (await import("@editorjs/header")).default
    // const Embed = (await import("@editorjs/embed")).default as never
    // const Table = (await import("@editorjs/table")).default as never
    // const List = (await import("@editorjs/list")).default as never
    // const Code = (await import("@editorjs/code")).default as never
    // const LinkTool = (await import("@editorjs/link")).default as never
    // const InlineCode = (await import("@editorjs/inline-code")).default as never
    // const ImageTool = (await import("@editorjs/image")).default as never
    // const AttachesTool = (await import("@editorjs/attaches")).default as never

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder:
          "Workspace descriptions (accept text, image, file, code snippet, ...)",
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: EditorHeader,
          linkTool: {
            class: EditorLink,
            config: {
              endpoint: "/api/editor/link",
            },
          },
          image: {
            class: EditorImage as never,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const { data } = await supabase.storage
                    .from("images")
                    .upload(workspaceId, file)

                  return {
                    success: 1,
                    file: {
                      url: `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/images/${data?.path}`,
                    },
                  }
                },
              },
              endpoints: {
                byFile: "/api/upload",
              },
            },
          },
          attaches: {
            class: EditorAttaches as never,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const { data } = await supabase.storage
                    .from("images")
                    .upload(workspaceId, file)

                  return {
                    success: 1,
                    file: {
                      title: file.name,
                      name: file.name,
                      url: `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/images/${data?.path}`,
                    },
                  }
                },
              },
            },
          },
          list: EditorList,
          code: EditorCode,
          inlineCode: EditorInlineCode,
          table: EditorTable,
          embed: EditorEmbed,
        },
      })
    }
  }, [workspaceId])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        // _titleRef?.current?.focus()
      }, 0)
    }

    if (isMounted) {
      void init()

      return () => {
        // ref.current?.destroy()
        // ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  if (!isMounted) {
    return null
  }

  return (
    <div className={styles["editor-layout"]}>
      <form id="subreddit-post-form" className={styles["editor-form"]}>
        <div>
          <TextareaAutosize
            placeholder="Title"
            className={styles["editor-title"]}
          />
          <div id="editor" className={styles["editor"]} />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  )
}
