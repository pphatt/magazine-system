import * as React from "react"

export default function ProtectedAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
