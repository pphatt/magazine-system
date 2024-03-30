// "use client"
//
// import * as React from "react"
// import type { ChangeEventHandler } from "react"
// import { useRouter } from "next/navigation"
// import { supabase } from "@/server/supabase/supabase"
// import type EditorJS from "@editorjs/editorjs"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useMutation } from "@tanstack/react-query"
// import { format, set } from "date-fns"
// import type { SelectSingleEventHandler } from "react-day-picker"
// import { useForm } from "react-hook-form"
// import TextareaAutosize from "react-textarea-autosize"
// import { toast } from "sonner"
// import { v4 } from "uuid"
// // import type { z } from "zod"
//
// import { cn } from "@/lib/utils"
// // import { workspaceSchema } from "@/lib/validations/workspace"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form"
// import { PopoverTrigger } from "@/components/ui/popover"
// import { EditorAttaches } from "@/components/editor/attaches"
// import { EditorCode } from "@/components/editor/code"
// import { EditorEmbed } from "@/components/editor/embed"
// import { EditorHeader } from "@/components/editor/header"
// import { EditorImage } from "@/components/editor/image"
// import { EditorInlineCode } from "@/components/editor/inline-code"
// import { EditorLink } from "@/components/editor/link"
// import { EditorList } from "@/components/editor/list"
// import { EditorTable } from "@/components/editor/table"
// import styles from "@/styles/components/editor.module.scss"
//
// import { Icons } from "../icons"
// import { Button } from "../ui/button"
// import { Popover, PopoverContent } from "../ui/popover"
//
// // export type WorkspaceCreationRequest = z.infer<typeof workspaceSchema>
//
// interface EditorProps {
//   faculty: string
// }
//
// export function Editor({ faculty }: EditorProps) {
//   const today = new Date()
//
//   const [isMounted, setIsMounted] = React.useState<boolean>(false)
//
//   const [selectedClosureDate, setSelectClosureDate] =
//     React.useState<Date>(today)
//   const [closureDateWithTime, setClosureDateWithTime] =
//     React.useState<Date>(today)
//
//   const [selectedFinalClosureDate, setSelectFinalClosureDate] =
//     React.useState<Date>(today)
//   const [finalClosureDateWithTime, setFinalClosureDateWithTime] =
//     React.useState<Date>(today)
//
//   const form = useForm<WorkspaceCreationRequest>({
//     resolver: zodResolver(workspaceSchema),
//     defaultValues: {
//       title: "",
//       content: null,
//       closureDate: new Date(),
//       finalClosureDate: new Date(),
//     },
//   })
//
//   const router = useRouter()
//
//   const ref = React.useRef<EditorJS>()
//
//   const { mutate: createWorkspace } = useMutation({
//     mutationFn: async ({
//       title,
//       content,
//       closureDate,
//       finalClosureDate,
//     }: WorkspaceCreationRequest) => {
//       const payload: WorkspaceCreationRequest = {
//         title,
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         content,
//         closureDate,
//         finalClosureDate,
//       }
//       const response = await fetch("/api/workspace/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })
//
//       return (await response.json()) as unknown
//     },
//     onError: () => {
//       toast.warning("Something went wrong.", {
//         description: "Your post was not published. Please try again.",
//       })
//     },
//     onSuccess: () => {
//       toast("Workspace created successfully.")
//       router.push("/faculty")
//       router.refresh()
//     },
//   })
//
//   const initializeEditor = React.useCallback(async () => {
//     const EditorJS = (await import("@editorjs/editorjs")).default
//
//     if (!ref.current) {
//       const editor = new EditorJS({
//         holder: "editor",
//         onReady() {
//           ref.current = editor
//         },
//         placeholder:
//           "Workspace descriptions (accept text, image, file, code snippet, ...)",
//         inlineToolbar: true,
//         data: {
//           blocks: [],
//         },
//         tools: {
//           header: EditorHeader,
//           linkTool: {
//             class: EditorLink,
//             config: {
//               endpoint: "/api/editor/link",
//             },
//           },
//           image: {
//             class: EditorImage as never,
//             config: {
//               uploader: {
//                 async uploadByFile(file: File) {
//                   const { data } = await supabase.storage
//                     .from("faculty-assets")
//                     .upload(`${faculty}/${v4()}/${file.name}`, file)
//
//                   return {
//                     success: 1,
//                     file: {
//                       url: `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/faculty-assets/${data?.path}`,
//                     },
//                   }
//                 },
//               },
//               endpoints: {
//                 byFile: "/api/upload",
//               },
//             },
//           },
//           attaches: {
//             class: EditorAttaches as never,
//             config: {
//               types: ".doc, .docx, .pdf",
//               uploader: {
//                 async uploadByFile(file: File) {
//                   const { data } = await supabase.storage
//                     .from("faculty-assets")
//                     .upload(`${faculty}/${v4()}/${file.name}`, file)
//
//                   return {
//                     success: 1,
//                     file: {
//                       title: file.name,
//                       name: file.name,
//                       url: `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/faculty-assets/${data?.path}`,
//                     },
//                   }
//                 },
//               },
//             },
//           },
//           list: EditorList,
//           code: EditorCode,
//           inlineCode: EditorInlineCode,
//           table: EditorTable,
//           embed: EditorEmbed,
//         },
//       })
//     }
//   }, [faculty])
//
//   React.useEffect(() => {
//     if (Object.keys(form.formState.errors).length) {
//       for (const [_key, value] of Object.entries(form.formState.errors)) {
//         console.log(_key)
//         toast.warning("Something went wrong.", {
//           description: (value as { message: string }).message,
//         })
//       }
//     }
//   }, [form.formState.errors])
//
//   React.useEffect(() => {
//     if (typeof window !== "undefined") {
//       setIsMounted(true)
//     }
//   }, [])
//
//   React.useEffect(() => {
//     const init = async () => {
//       await initializeEditor()
//
//       setTimeout(() => {
//         // _titleRef?.current?.focus()
//       }, 0)
//     }
//
//     if (isMounted) {
//       void init()
//
//       return () => {
//         // ref.current?.destroy()
//         // ref.current = undefined
//       }
//     }
//   }, [isMounted, initializeEditor])
//
//   async function onSubmit(data: WorkspaceCreationRequest) {
//     const blocks = await ref.current?.save()
//
//     const payload: WorkspaceCreationRequest = {
//       title: data.title,
//       content: blocks,
//       closureDate: closureDateWithTime,
//       finalClosureDate: finalClosureDateWithTime,
//     }
//
//     createWorkspace(payload)
//   }
//
//   const handleClosureDateTimeChange: ChangeEventHandler<HTMLInputElement> =
//     React.useCallback(
//       (e) => {
//         const { value } = e.target
//
//         const hours = Number.parseInt(value.split(":")[0] || "00", 10)
//         const minutes = Number.parseInt(value.split(":")[1] || "00", 10)
//         const seconds = Number.parseInt(value.split(":")[2] || "00", 10)
//
//         setClosureDateWithTime(
//           set(selectedClosureDate, { hours, minutes, seconds })
//         )
//       },
//       [selectedClosureDate]
//     )
//
//   const handleClosureDateSelect: SelectSingleEventHandler = React.useCallback(
//     (_day, selected) => {
//       setSelectClosureDate(selected)
//
//       const hours = closureDateWithTime.getHours()
//       const minutes = closureDateWithTime.getMinutes()
//       const seconds = closureDateWithTime.getSeconds()
//
//       setClosureDateWithTime(set(selected, { hours, minutes, seconds }))
//     },
//     [closureDateWithTime]
//   )
//
//   const handleFinalClosureDateTimeChange: ChangeEventHandler<HTMLInputElement> =
//     React.useCallback(
//       (e) => {
//         const { value } = e.target
//
//         const hours = Number.parseInt(value.split(":")[0] || "00", 10)
//         const minutes = Number.parseInt(value.split(":")[1] || "00", 10)
//         const seconds = Number.parseInt(value.split(":")[2] || "00", 10)
//
//         setFinalClosureDateWithTime(
//           set(selectedFinalClosureDate, { hours, minutes, seconds })
//         )
//       },
//       [selectedFinalClosureDate]
//     )
//
//   const handleFinalClosureDateSelect: SelectSingleEventHandler =
//     React.useCallback(
//       (_day, selected) => {
//         setSelectFinalClosureDate(selected)
//
//         const hours = finalClosureDateWithTime.getHours()
//         const minutes = finalClosureDateWithTime.getMinutes()
//         const seconds = finalClosureDateWithTime.getSeconds()
//
//         setFinalClosureDateWithTime(set(selected, { hours, minutes, seconds }))
//       },
//       [finalClosureDateWithTime]
//     )
//
//   if (!isMounted) {
//     return null
//   }
//
//   const closureDateTime = (
//     <div className={styles["footer"]}>
//       <label>Time: </label>
//       <input
//         type="time"
//         step="1"
//         onChange={handleClosureDateTimeChange}
//         value={format(closureDateWithTime, "HH:mm:ss")}
//       />
//     </div>
//   )
//
//   const finalClosureDateTime = (
//     <div className={styles["footer"]}>
//       <label>Time: </label>
//       <input
//         type="time"
//         step="1"
//         onChange={handleFinalClosureDateTimeChange}
//         value={format(finalClosureDateWithTime, "HH:mm:ss")}
//       />
//     </div>
//   )
//
//   return (
//     <div className={styles["editor-layout"]}>
//       <Form {...form}>
//         <form
//           id="workspace-post-form"
//           className={styles["editor-form"]}
//           onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
//         >
//           <div>
//             <TextareaAutosize
//               placeholder="Title"
//               className={styles["editor-title"]}
//               {...form.register("title")}
//             />
//             <div id="editor" className={styles["editor"]} />
//           </div>
//           <div>
//             <FormField
//               control={form.control}
//               name="closureDate"
//               render={() => (
//                 <FormItem className={styles["form"]}>
//                   <FormLabel>Closure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-[240px] pl-3 text-left font-normal",
//                             !selectedClosureDate && "text-muted-foreground"
//                           )}
//                         >
//                           {selectedClosureDate ? (
//                             format(closureDateWithTime, "PPP HH:mm:ss")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <Icons.calendarIcon
//                             className={styles["calendar-icon"]}
//                           />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent
//                       className={styles["popover-content"]}
//                       align="start"
//                     >
//                       <Calendar
//                         mode="single"
//                         selected={selectedClosureDate}
//                         onSelect={handleClosureDateSelect}
//                         footer={closureDateTime}
//                         disabled={(date) =>
//                           date < new Date()
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </FormItem>
//               )}
//             />
//
//             <FormField
//               control={form.control}
//               name="finalClosureDate"
//               render={() => (
//                 <FormItem className={styles["form"]}>
//                   <FormLabel>Final Closure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-[240px] pl-3 text-left font-normal",
//                             !selectedFinalClosureDate && "text-muted-foreground"
//                           )}
//                         >
//                           {selectedFinalClosureDate ? (
//                             format(finalClosureDateWithTime, "PPP HH:mm:ss")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <Icons.calendarIcon
//                             className={styles["calendar-icon"]}
//                           />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent
//                       className={styles["popover-content"]}
//                       align="start"
//                     >
//                       <Calendar
//                         mode="single"
//                         selected={selectedFinalClosureDate}
//                         onSelect={handleFinalClosureDateSelect}
//                         footer={finalClosureDateTime}
//                         disabled={(date) =>
//                           date < new Date()
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </FormItem>
//               )}
//             />
//           </div>
//         </form>
//       </Form>
//     </div>
//   )
// }
