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

export const adminSiteConfig = {
  name: "Greenwich blog",
  description: "A blog for greenwich student to submit their work",
  url: "",
  image: "",
  mainNav: [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "home",
      items: [],
    },
    {
      title: "User",
      href: "/admin/user?page=1&rows=50",
      icon: "users",
      items: [],
    },
    {
      title: "Faculty",
      href: "/admin/faculty?page=1&rows=10",
      icon: "layers",
      items: [],
    },
    {
      title: "Academic Year",
      href: "/admin/academic-year",
      icon: "calendarDays",
      items: [],
    },
  ] as MainNavItem[],
}
