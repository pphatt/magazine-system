import type { Block } from "@/types/index"

export {}

declare global {
  namespace PrismaJson {
    // you can use classes, interfaces, types, etc.
    type ContentType = {
      time: Date
      blocks: Block[]
      version: string
    }
  }
}
