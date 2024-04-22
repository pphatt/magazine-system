import * as React from "react"
import { db } from "@/server/db"

import { getData } from "@/lib/fetchers/dashboard"
import { ManageChart } from "@/components/dashboard/chart"
import styles from "@/styles/(lobby)/contribution/manage/page.module.scss"

export default async function ManagePage() {
  const data = await getData()

  const blogs = await db.blogs.findMany()

  const approve_blogs = blogs.filter((blog) => blog.status === "APPROVE")
  const reject_blogs = blogs.filter((blog) => blog.status === "REJECT")

  return (
    <div className={styles["manage-page-wrapper"]}>
      <div className={styles["text"]}>
        <h1>Statistic analysis</h1>
      </div>
      <div className={styles["manage-card"]}>
        <div className={styles["card-wrapper"]}>
          <div className={styles["card-container"]}>
            <h4>Total blogs</h4>
            <div className={styles["count"]}>{blogs.length}</div>
          </div>
        </div>
        <div className={styles["card-wrapper"]}>
          <div className={styles["card-container"]}>
            <h4>Total accept blogs</h4>
            <div className={styles["count"]}>{approve_blogs.length}</div>
          </div>
        </div>
        <div className={styles["card-wrapper"]}>
          <div className={styles["card-container"]}>
            <h4>Total reject blogs</h4>
            <div className={styles["count"]}>{reject_blogs.length}</div>
          </div>
        </div>
      </div>
      <div className={styles["chart"]}>
        <ManageChart data={data} />
      </div>
    </div>
  )
}
