"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/server/supabase/supabase"
import type EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import { v4 } from "uuid"
import type { z } from "zod"

import { cn } from "@/lib/utils"
import { workspaceSchema } from "@/lib/validations/workspace"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { PopoverTrigger } from "@/components/ui/popover"
import { EditorAttaches } from "@/components/editor/attaches"
import { EditorCode } from "@/components/editor/code"
import { EditorEmbed } from "@/components/editor/embed"
import { EditorHeader } from "@/components/editor/header"
import { EditorImage } from "@/components/editor/image"
import { EditorInlineCode } from "@/components/editor/inline-code"
import { EditorLink } from "@/components/editor/link"
import { EditorList } from "@/components/editor/list"
import { EditorTable } from "@/components/editor/table"
import styles from "@/styles/components/editor.module.scss"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Popover, PopoverContent } from "../ui/popover"

export type WorkspaceCreationRequest = z.infer<typeof workspaceSchema>

interface EditorProps {
  faculty: string
}

export function Editor({ faculty }: EditorProps) {
  const form = useForm<WorkspaceCreationRequest>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      title: "",
      content: null,
      deadline: new Date(),
    },
  })

  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const router = useRouter()

  const ref = React.useRef<EditorJS>()

  const { mutate: createWorkspace } = useMutation({
    mutationFn: async ({
      title,
      content,
      deadline,
    }: WorkspaceCreationRequest) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: WorkspaceCreationRequest = { title, content, deadline }
      const response = await fetch("/api/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      return (await response.json()) as unknown
    },
    onError: () => {
      toast.warning("Something went wrong.", {
        description: "Your post was not published. Please try again.",
      })
    },
    onSuccess: () => {
      toast("Workspace created successfully.")
      router.push("/faculty")
      router.refresh()
    },
  })

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default

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
                    .from("faculty-assets")
                    .upload(`${faculty}/${v4()}`, file)

                  return {
                    success: 1,
                    file: {
                      url: `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/faculty-assets/${data?.path}`,
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
              types: ".doc, .docx, .pdf",
              uploader: {
                async uploadByFile(file: File) {
                  const { data } = await supabase.storage
                    .from("faculty-assets")
                    .upload(`${faculty}/${v4()}`, file)

                  return {
                    success: 1,
                    file: {
                      title: file.name,
                      name: file.name,
                      url: `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/faculty-assets/${data?.path}`,
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
  }, [faculty])

  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length) {
      for (const [_key, value] of Object.entries(form.formState.errors)) {
        console.log(_key)
        toast.warning("Something went wrong.", {
          description: (value as { message: string }).message,
        })
      }
    }
  }, [form.formState.errors])

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

  async function onSubmit(data: WorkspaceCreationRequest) {
    const blocks = await ref.current?.save()

    const payload: WorkspaceCreationRequest = {
      title: data.title,
      content: blocks,
      deadline: data.deadline,
    }

    createWorkspace(payload)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className={styles["editor-layout"]}>
      <Form {...form}>
        <form
          id="workspace-post-form"
          className={styles["editor-form"]}
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <div>
            <TextareaAutosize
              placeholder="Title"
              className={styles["editor-title"]}
              {...form.register("title")}
            />
            <div id="editor" className={styles["editor"]} />
          </div>
          <div>
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className={styles["form"]}>
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Icons.calendarIcon
                            className={styles["calendar-icon"]}
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className={styles["popover-content"]}
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
