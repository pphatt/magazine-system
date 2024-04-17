import * as React from "react"
import Link from "next/link"

import { Icons } from "@/components/icons"
import styles from "@/styles/components/layouts/site-footer.module.scss"

export function SiteFooter() {
  return (
    <footer className={styles["footer-wrapper"]}>
      <div className={styles["footer-container"]}>
        <div className={styles["footer-link-wrapper"]}>
          <div className={styles["footer-useful-link"]}>
            <div className={styles["links-wrapper"]}>
              <span>PHONE NUMBER</span>
              <div className={styles["line"]}></div>
              <div className={styles["links-container"]}>
                <span>09012345678</span>
              </div>
            </div>
            <div className={styles["links-wrapper"]}>
              <span>USEFUL LINKS</span>
              <div className={styles["line"]}></div>
              <div className={styles["links-container"]}>
                <Link href={"/"}>
                  <span>ABOUT</span>
                </Link>
                <Link href={"/"}>
                  <span>CONTACT</span>
                </Link>
                <Link href={"/"}>
                  <span>TERM OF USE</span>
                </Link>
                <Link href={"/"}>
                  <span>PRIVACY POLICY</span>
                </Link>
                <Link href={"/"}>
                  <span>COPYRIGHT</span>
                </Link>
              </div>
            </div>
            <div className={styles["links-wrapper"]}>
              <span>SOCIAL MEDIA</span>
              <div className={styles["line"]}></div>
              <div className={styles["social-media-container"]}>
                <Link href={"/"}>
                  <Icons.twitter />
                </Link>
                <Link href={"/"}>
                  <Icons.instagram />
                </Link>
                <Link href={"/"}>
                  <Icons.facebook />
                </Link>
                <Link href={"/"}>
                  <Icons.tiktok fill={"#fff"} />
                </Link>
                <Link href={"/"}>
                  <Icons.linkedin fill={"#fff"} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
