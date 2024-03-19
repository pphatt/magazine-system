import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import styles from "@/styles/(lobby)/_components/faculty.module.scss"

const faculties = [
  { faculty: "IT & Software", description: "100 Workspace", href: "/" },
  { faculty: "Photography", description: "100 Workspace", href: "/" },
  { faculty: "Marketing", description: "100 Workspace", href: "/" },
]

export function Faculty() {
  return (
    <div className={styles["faculty-wrapper"]}>
      <div className={styles["faculty-container"]}>
        <div className={styles["faculty-header-wrapper"]}>
          <div className={styles["faculty-header-container"]}>
            <h2>Our Faculties</h2>
            <p>
              We help students achieve academic excellence in a diverse range of
              disciplines and fields – through our excellent faculties.
            </p>
          </div>
        </div>
        <div className={styles["faculty-card-wrapper"]}>
          {faculties.map(({ faculty, description, href }, index) => (
            <div key={index} className={styles["faculty-card"]}>
              <div className={styles["faculty-card-img"]}>
                <img src={"images/course-1.jpg"} alt={""} />
              </div>
              <div className={styles["faculty-card-content"]}>
                <h3>
                  <Link href={href}>{faculty}</Link>
                </h3>
                <p>{description}</p>
                <Button variant={"outline"} className={styles["view"]}>
                  <Link href={href}>View Now</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
