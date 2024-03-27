import * as React from "react"
import Link from "next/link"

import { Icons } from "@/components/icons"
import styles from "@/styles/components/layouts/site-footer.module.scss"

export function SiteFooter() {
  return (
    <footer className={styles["footer-wrapper"]}>
      <div className={styles["footer-container"]}>
        <div className={styles["footer-rows"]}>
          <div className={styles["footer-column"]}>
            <div className={styles["footer-information"]}>
              <h2>Have a Questions?</h2>
              <div className={styles["footer-information-lists"]}>
                <ul>
                  <li className={styles["footer-information-list"]}>
                    <Icons.mapPin />
                    <span>
                      203 Fake St. Mountain View, San Francisco, California, USA
                    </span>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Icons.phone />
                    <span>+2 392 3929 210</span>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Icons.mail />
                    <span>info@test.cms.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles["footer-column"]}>
            <div className={styles["footer-information"]}>
              <h2>Resources</h2>
              <div className={styles["footer-information-lists"]}>
                <ul>
                  <li className={styles["footer-information-list"]}>
                    <Link
                      href={"/"}
                      className={styles["footer-information-list"]}
                    >
                      <Icons.moveRight />
                      <span>HOME</span>
                    </Link>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Link
                      href={"/"}
                      className={styles["footer-information-list"]}
                    >
                      <Icons.moveRight />
                      <span>FACULTY</span>
                    </Link>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Link
                      href={"/"}
                      className={styles["footer-information-list"]}
                    >
                      <Icons.moveRight />
                      <span>ABOUT</span>
                    </Link>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Link
                      href={"/"}
                      className={styles["footer-information-list"]}
                    >
                      <Icons.moveRight />
                      <span>SERVICES</span>
                    </Link>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Link
                      href={"/"}
                      className={styles["footer-information-list"]}
                    >
                      <Icons.moveRight />
                      <span>DEPARTMENTS</span>
                    </Link>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Link
                      href={"/"}
                      className={styles["footer-information-list"]}
                    >
                      <Icons.moveRight />
                      <span>CONTACT</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles["footer-column"]}>
            <div className={styles["footer-information"]}>
              <h2>Connect With Us</h2>
              <div className={styles["footer-information-lists"]}>
                <ul>
                  <li className={styles["footer-information-list"]}>
                    <Icons.twitter />
                    <span>Twitter</span>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Icons.facebook />
                    <span>Facebook</span>
                  </li>
                  <li className={styles["footer-information-list"]}>
                    <Icons.instagram />
                    <span>Instagram</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
