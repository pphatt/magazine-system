import Link from "next/link"
import type { ContentType, LinkMeta } from "@/types"

import { cn } from "@/lib/utils"
import styles from "@/styles/components/render-blog.module.scss"

export function RenderBlog({ content }: ContentType) {
  return (
    <>
      {content.map((value, index) => {
        const { data, type } = value

        if (type === "paragraph") {
          return <RenderParagraph key={index} text={data.text} />
        }

        if (type === "header") {
          return <RenderHeader text={data.text} level={data.level} />
        }

        if (type === "list") {
          return <RenderList items={data.items} style={data.style} />
        }

        if (type === "linkTool") {
          return <RenderLink data={data} />
        }

        return <p key={index} className={styles["paragraph"]}></p>
      })}
    </>
  )
}

function RenderParagraph({ text }: { text: string }) {
  return (
    <p
      dangerouslySetInnerHTML={{ __html: text }}
      className={styles["paragraph"]}
    ></p>
  )
}

function RenderHeader({ text, level }: { text: string; level: number }) {
  if (level === 1) {
    return (
      <h1 className={cn(styles["heading"], styles["heading-1"])}>{text}</h1>
    )
  }

  if (level === 2) {
    return (
      <h2 className={cn(styles["heading"], styles["heading-2"])}>{text}</h2>
    )
  }

  if (level === 3) {
    return (
      <h3 className={cn(styles["heading"], styles["heading-3"])}>{text}</h3>
    )
  }

  if (level === 4) {
    return <h4 className={styles["heading"]}>{text}</h4>
  }

  if (level === 5) {
    return <h5 className={styles["heading"]}>{text}</h5>
  }

  if (level === 6) {
    return <h6 className={styles["heading"]}>{text}</h6>
  }

  return <h6 className={styles["heading"]}>{text}</h6>
}

function RenderList({ items, style }: { items: string[]; style: string }) {
  if (style === "ordered") {
    return (
      <ol className={styles["ordered-list"]}>
        {items.map((value, index) => (
          <li className={styles["list-item"]} key={index}>
            {value}
          </li>
        ))}
      </ol>
    )
  }

  if (style === "unordered") {
    return (
      <ul className={styles["unordered-list"]}>
        {items.map((value, index) => (
          <li className={styles["list-item"]} key={index}>
            {value}
          </li>
        ))}
      </ul>
    )
  }
}

function RenderLink({ data }: { data: { link: string; meta: LinkMeta } }) {
  return (
    <Link className={styles["link"]} target="_blank" href={data.link}>
      <div className={styles["link-title"]}>{data.meta.title}</div>
      <p className={styles["link-description"]}>{data.meta.description}</p>
      <span className={styles["link-anchor"]}>
        {data.link.split("//")[1]!.trim().replace("/", "")}
      </span>
    </Link>
  )
}
