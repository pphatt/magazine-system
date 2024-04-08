import styles from "@/styles/components/comments/theme.module.scss"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  code: "editor-code",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  ltr: styles["ltr"],
  paragraph: styles["editor-paragraph"],
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: styles["rtl"],
  text: {
    bold: styles["editor-text-bold"],
    code: styles['editor-text-code'],
    hashtag: styles['editor-text-hashtag'],
    italic: styles["editor-text-italic"],
    overflowed: styles["editor-text-overflowed"],
    strikethrough: styles["editor-text-strikethrough"],
    underline: styles["editor-text-underline"],
    underlineStrikethrough: styles['editor-text-underlineStrikethrough'],
  },
}
