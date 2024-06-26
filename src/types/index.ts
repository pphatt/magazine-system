import type { Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export type SidebarNavItem = NavItemWithChildren

export type MainNavItem = NavItemWithOptionalChildren

type BlockType<T> = T extends "paragraph"
  ? { id: string; data: { text: string }; type: "paragraph" }
  : T extends "header"
    ? { id: string; data: { text: string; level: number }; type: "header" }
    : T extends "list"
      ? {
          id: string
          data: {
            text: string
            items: string[]
            style: "ordered" | "unordered"
          }
          type: "list"
        }
      : T extends "linkTool"
        ? {
            id: string
            data: { link: string; meta: LinkMeta }
            type: "linkTool"
          }
        : T extends "image"
          ? {
              id: string
              data: {
                file: { url: string }
                caption: string
                stretched: boolean
                withBorder: boolean
                withBackground: boolean
              }
              type: "image"
            }
          : T extends "attaches"
            ? {
                id: string
                data: {
                  file: { url: string; name: string; title: string }
                  title: string
                }
                type: "attaches"
              }
            : never

export type LinkMeta = {
  image: {
    url: string
  }
  title: string
  description: string
}

export type Block = BlockType<"paragraph" | "header" | "list" | "linkTool">

export type ContentType = {
  content: Block[]
}

export type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}
