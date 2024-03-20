import * as React from "react"

import { Button } from "@/components/ui/button"
import styles from "@/styles/(lobby)/_components/recent-blog.module.scss"

export function RecentBlog() {
  return (
    <div className={styles["recent-blog-wrapper"]}>
      <div className={styles["recent-blog-container"]}>
        <div className={styles["recent-blog-header-wrapper"]}>
          <div className={styles["recent-blog-header-container"]}>
            <h2 className={styles["recent-blog-header"]}>Recent Blog</h2>
            <p>
              Separated they live in. A small river named Duden flows by their
              place and supplies it with the necessary regelialia. It is a
              paradisematic country
            </p>
          </div>
        </div>
        <div className={styles["recent-blog-items-wrapper"]}>
          {[...(new Array(3) as number[])].map((_, index) => (
            <div className={styles["recent-blog-card-wrapper"]} key={index}>
              <div className={styles["recent-blog-card-container"]}>
                <div className={styles["recent-blog-card-image"]}>
                  <img src={"images/image_1.jpg"} alt={""} />
                </div>
                <div className={styles["recent-blog-card-content"]}>
                  <h3 className={styles["recent-card-h3"]}>
                    <a href="#">Skills To Develop Your Child Memory</a>
                  </h3>
                  <p>
                    Far far away, behind the word mountains, far from the
                    countries Vokalia and Consonantia, there live the blind
                    texts.
                  </p>
                  <div className={styles["recent-card-feature"]}>
                    <Button variant={"outline"} className={styles["view"]}>
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
