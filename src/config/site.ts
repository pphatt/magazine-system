import type { MainNavItem } from "@/types"

export type SiteConfig = typeof siteConfig

const links = {
  twitter: "",
}

export const siteConfig = {
  name: "Greenwich blog",
  description: "A blog for greenwich student to submit their work",
  url: "",
  image: "",
  mainNav: [
    {
      title: "Home",
      href: "/",
      icon: "home",
      items: [],
    },
    {
      title: "Faculty",
      href: "/faculty",
      icon: "",
      items: [],
    },
  ] as MainNavItem[],
  links,
  footerNav: [
    {
      title: "",
      items: [
        {
          title: "",
          href: "",
        },
        {
          title: "",
          href: "",
        },
        {
          title: "",
          href: "",
        },
      ],
    },
  ],
}
