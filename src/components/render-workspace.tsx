import * as React from "react"
import dynamic from "next/dynamic"

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
)

interface RenderWorkspaceProps {
  content: any
}

// const renderers: {image: ({data: any}) => React.ReactNode} = {
//   image: CustomImageRenderer,
// }

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
}

export function RenderWorkspace({ content }: RenderWorkspaceProps) {
  return (
    <Output
      style={style}
      className="text-sm"
      // renderers={renderers}
      data={content}
    />
  )
}
