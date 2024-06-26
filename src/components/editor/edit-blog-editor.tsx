"use client"

import * as React from "react"
import type EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import type { z } from "zod"

import { uploadEditContributionSchema } from "@/lib/validations/contribution"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EditorCode } from "@/components/editor/code"
import { EditorEmbed } from "@/components/editor/embed"
import { EditorHeader } from "@/components/editor/header"
import { EditorInlineCode } from "@/components/editor/inline-code"
import { EditorLink } from "@/components/editor/link"
import { EditorList } from "@/components/editor/list"
import { EditorTable } from "@/components/editor/table"
import styles from "@/styles/components/editor/edit-blog-editor.module.scss"

// Import FilePond styles
import "filepond/dist/filepond.min.css"

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { env } from "@/env"
import type { Block } from "@/types"
import { useMutation } from "@tanstack/react-query"
import type { FilePondFile, FilePondInitialFile } from "filepond"

import { editBlog } from "@/lib/actions/contribution"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
)

export type BlogInputs = z.infer<typeof uploadEditContributionSchema>

interface EditorProps {
  blogId: string
  title: string
  content: Block[]
  backgroundImage: string
  prevFiles: string[]
  facultyId: string
  academicYearId: string
}

export default function EditBlogEditor({
  blogId,
  title,
  content,
  backgroundImage,
  prevFiles,
  academicYearId,
  facultyId,
}: EditorProps) {
  const [agree, setAgree] = React.useState(false)

  const [newFilesCount, setNewFilesCount] = React.useState(0)
  const [files, setFiles] = React.useState<
    FilePondInitialFile[] | FilePondFile[]
  >(
    prevFiles.map((value) => {
      return {
        source: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/${value}`,
        options: { type: "local" },
      }
    }) as FilePondInitialFile[]
  )

  const [previewImage, setPreviewImage] =
    React.useState<string>(backgroundImage)

  const router = useRouter()

  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const form = useForm<BlogInputs>({
    resolver: zodResolver(uploadEditContributionSchema),
    defaultValues: {
      contributionId: blogId,
      title: title,
      content: content,
      academicYearId: "",
      facultyId: "",
      newFilesCount,
    },
  })

  const { mutate: uploadBlog, isPending } = useMutation({
    mutationFn: async ({ image, files, ...data }: BlogInputs) => {
      const formData = new FormData()

      formData.set("data", JSON.stringify(data))

      for (const file of files) {
        const fileCovert = new File([file.file], file.filename, {
          lastModified: Date.now(),
        })
        formData.append("files[]", fileCovert)
      }

      if (image) {
        formData.set("image", image)
      }

      const req = await editBlog(formData)

      if ("success" in req) {
        router.push(`/contribution/blog/${req.success?.blogId}`)
      }
    },
    onError: () => {
      toast.error("Something went wrong.", {
        description: "Your blog was not published. Please try again.",
      })
    },
    onSuccess: () => {
      toast.success("Edit blog successfully.")
      router.refresh()
    },
  })

  const ref = React.useRef<EditorJS>()

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Blog descriptions (accept text, code snippet, ...)",
        inlineToolbar: true,
        data: {
          blocks: content,
        },
        tools: {
          header: EditorHeader,
          linkTool: {
            class: EditorLink,
            config: {
              endpoint: "/api/editor/link",
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
  }, [content])

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

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (!files) {
      return
    }

    const file = files[0]

    if (!file) {
      return
    }

    if (file.size > 5000000) {
      toast.warning("Max image size is 5MB.")
      return
    }

    const fileReader = new FileReader()

    fileReader.addEventListener("load", () => {
      setPreviewImage(fileReader.result as string)
    })

    fileReader.readAsDataURL(file)
  }

  async function onSubmit(data: BlogInputs) {
    if (!files.length) {
      toast.warning("No submit files were recorded")
      return
    }

    const blocks = await ref.current?.save()

    const payload: BlogInputs = {
      ...data,
      content: blocks,
      academicYearId,
      facultyId,
      files: files as FilePondFile[],
      prevImage: backgroundImage.split(
        `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/`
      )[1]!,
      prevFiles,
      newFilesCount,
    }

    uploadBlog(payload)
  }

  return (
    <div className={styles["editor-layout"]}>
      <Form {...form}>
        <form
          id={"blog-post-form"}
          className={styles["editor-form"]}
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <div>
            <TextareaAutosize
              placeholder="Title"
              className={styles["editor-title"]}
              {...form.register("title")}
              defaultValue={title}
            />

            <div id="editor" className={styles["editor"]} />

            <FormField
              control={form.control}
              name="image"
              render={({
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                field: { value, onChange, ...fieldProps },
              }) => (
                <FormItem className={styles["image-input"]}>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type={"file"}
                      accept={"image/png, image/jpg, image/jpeg"}
                      className={styles["cover-image-input"]}
                      id={"image"}
                      onChange={(event) => {
                        handleSelectImage(event)
                        onChange(event.target.files && event.target.files[0])
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={styles["background-image-wrapper"]}>
            <Button variant={"outline"} type={"button"} asChild>
              <label htmlFor={"image"}>Add cover image</label>
            </Button>

            {previewImage && (
              <img
                alt={""}
                className={styles["background-image-cover"]}
                src={previewImage}
              />
            )}
          </div>

          <FilePond
            className={styles["upload-files"]}
            // @ts-expect-error @ts-ignore
            files={files}
            onupdatefiles={(files) => {
              setFiles(files)
              setNewFilesCount(newFilesCount + 1)
            }}
            onremovefile={() => {
              if (newFilesCount > 0) {
                setNewFilesCount(newFilesCount - 1)
              }
            }}
            allowMultiple={true}
            name="files"
            server={{
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              load: async (source, load) => {
                const myRequest = new Request(source as RequestInfo | URL)

                const req = await fetch(myRequest)

                const blob = await req.blob()

                load(blob)
              },
            }}
            // set allowed file types with image/*, .doc, .docx, .pdf
            acceptedFileTypes={[
              "image/jpeg",
              "image/jpg",
              "image/png",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/pdf",
            ]}
            labelIdle='Drag & Drop your submit files or <span class="filepond--label-action">Browse</span>'
          />

          <div className={styles["submit-group"]}>
            <div className={styles["checkbox-term"]}>
              <Checkbox
                id="terms"
                checked={agree}
                onCheckedChange={() => setAgree(!agree)}
                disabled={isPending}
              />
              <label htmlFor="terms">Accept terms and conditions</label>
            </div>

            <div className={styles["submit-btn-group"]}>
              <Button
                type="button"
                variant={"outline"}
                disabled={isPending}
                className={styles["submit-btn"]}
                asChild
              >
                <Link href={`/contribution/blog/${blogId}`}>Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={isPending || !agree}
                className={styles["submit-btn"]}
              >
                {isPending && (
                  <Icons.spinner
                    className={styles["icon"]}
                    aria-hidden="true"
                  />
                )}
                Confirm
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
