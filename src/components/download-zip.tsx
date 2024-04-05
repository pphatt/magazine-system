"use client"

import * as React from "react"
import JSZip from "jszip"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import styles from "@/styles/components/download-zip.module.scss"

export default function DownloadZip({ location }: { location: string[] }) {
  const [isPending, startTransition] = React.useTransition()

  const handleDownload = () => {
    startTransition(async () => {
      const files = location.map(
        (value) =>
          `https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contributions/${value}`
      )

      if (!!files.length) {
        const zip = new JSZip()

        // Add Files to the zip file
        for (let i = 0; i < files.length; i++) {
          zip.file(files[i]!.split("/").pop()!, files[i]!, { binary: true })
        }

        // Generate the zip file
        const zipData = await zip.generateAsync({
          type: "blob",
          streamFiles: true,
          compression: "DEFLATE",
        })

        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(zipData)
        link.download = "test.zip"
        link.click()
      }
    })
  }

  return (
    <Button onClick={handleDownload} disabled={isPending}>
      {isPending && (
        <Icons.spinner className={styles["icon"]} aria-hidden="true" />
      )}
      <span>Download as ZIP</span>
    </Button>
  )
}
