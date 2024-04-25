"use client"

import * as React from "react"
import { Dialog } from "@radix-ui/react-dialog"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/view-file.module.scss"

interface ViewFileProps {
  name: string
  url: string
}

export function ViewFile({ name, url }: ViewFileProps) {
  const getExtension = name.split(".")[1]

  const isDocument =
    getExtension === "doc" || getExtension === "docx" || getExtension === "pdf"

  return (
    <Dialog>
      <DialogTrigger>
        <Icons.viewFile />
      </DialogTrigger>
      <DialogContent
        className={styles["content"]}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className={styles["file"]}>
          {isDocument ? (
            <iframe
              src={`https://docs.google.com/gview?url=${url}&embedded=true`}
            ></iframe>
          ) : (
            <img src={url} alt={""} className={styles["image"]} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
