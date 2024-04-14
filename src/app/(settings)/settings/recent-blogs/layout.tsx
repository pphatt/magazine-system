import * as React from "react"

import { SelectRowInput } from "@/app/(lobby)/contribution/_components/select-row"
import { SelectStatusInput } from "@/app/(lobby)/contribution/_components/select-status"

export default function RecentBlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          width: "100%",
          marginBottom: "0.5rem",
        }}
      >
        <SelectStatusInput />
        <SelectRowInput />
      </div>

      {children}
    </div>
  )
}
