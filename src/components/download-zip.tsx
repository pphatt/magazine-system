"use client"

import * as React from "react"
import { env } from "@/env"
import JSZip from "jszip"

import { Button } from "@/components/ui/button"

export default function DownloadZip({
  name,
  location,
}: {
  name: string
  location: string[]
}) {
  const handleDownload = async () => {
    const files = location.map(
      (value) =>
        `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-contributions/${value}`
    )

    if (!!files.length) {
      const zip = new JSZip()

      // Add Files to the zip file
      for (let i = 0; i < files.length; i++) {
        const response = await fetch(files[i]!)
        const blob = await response.blob()

        zip.file(files[i]!.split("/").pop()!, blob, { binary: true })
      }

      // Generate the zip file
      const zipData = await zip.generateAsync({
        type: "blob",
        streamFiles: true,
        compression: "DEFLATE",
      })

      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(zipData)
      link.download = `${name}.zip`
      link.click()
    }
  }

  return (
    <Button onClick={handleDownload}>
      <span>Download as ZIP</span>
    </Button>
  )
}
