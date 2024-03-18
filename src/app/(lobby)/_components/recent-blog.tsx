import * as React from "react"

import styles from "@/styles/(lobby)/_components/recent-blog.module.scss"

export function RecentBlog() {
  return (
    <div className={styles["recent-wrapper"]}>
      <div className={styles["recent-header-wrapper"]}>
        <div className={styles["recent-header-container"]}>
          <h2 className={styles["recent-header-h2"]}>
            <span>Recent</span> Blog
          </h2>
          <p>
            Separated they live in. A small river named Duden flows by their
            place and supplies it with the necessary regelialia. It is a
            paradisematic country
          </p>
        </div>
      </div>
      <div className={styles["recent-card-wrapper"]}>
        <div className={styles["recent-card-container"]}>
          <div className={styles["recent-card"]}>
            <div
              className={styles["recent-card-img"]}
              style={{ backgroundImage: "url('images/image_1.jpg')" }}
            >
              <div className={styles["recent-card-date"]}>
                <span className={styles["card-day"]}>26</span>
                <span className={styles["card-month"]}>June</span>
                <span className={styles["card-year"]}>2019</span>
              </div>
            </div>
            <div className={styles["recent-card-content"]}>
              <h3 className={styles["recent-card-h3"]}>
                <a href="#">Skills To Develop Your Child Memory</a>
              </h3>
              <p>
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts.
              </p>
              <div className={styles["recent-card-feature"]}>
                <p className={styles["recent-card-readmore"]}>
                  <div className={styles["recent-card-btn"]}>
                    Read More{" "}
                    <span className="ion-ios-arrow-round-forward"></span>
                  </div>
                </p>
                <p className={styles["recent-card-role"]}>
                  <div className={styles["mr-2"]}>Admin</div>
                  <div className={styles["recent-card-chat"]}>
                    <span className={styles["icon-chat"]}></span> 3
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["recent-card-container"]}>
          <div className={styles["recent-card"]}>
            <div
              className={styles["recent-card-img"]}
              style={{ backgroundImage: "url('images/image_2.jpg')" }}
            >
              <div className={styles["recent-card-date"]}>
                <span className={styles["card-day"]}>26</span>
                <span className={styles["card-month"]}>June</span>
                <span className={styles["card-year"]}>2019</span>
              </div>
            </div>
            <div className={styles["recent-card-content"]}>
              <h3 className={styles["recent-card-h3"]}>
                <a href="#">Skills To Develop Your Child Memory</a>
              </h3>
              <p>
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts.
              </p>
              <div className={styles["recent-card-feature"]}>
                <p className={styles["recent-card-readmore"]}>
                  <div className={styles["recent-card-btn"]}>
                    Read More{" "}
                    <span className="ion-ios-arrow-round-forward"></span>
                  </div>
                </p>
                <p className={styles["recent-card-role"]}>
                  <div className={styles["mr-2"]}>Admin</div>
                  <div className={styles["recent-card-chat"]}>
                    <span className={styles["icon-chat"]}></span> 3
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["recent-card-container"]}>
          <div className={styles["recent-card"]}>
            <div
              className={styles["recent-card-img"]}
              style={{ backgroundImage: "url('images/image_3.jpg')" }}
            >
              <div className={styles["recent-card-date"]}>
                <span className={styles["card-day"]}>26</span>
                <span className={styles["card-month"]}>June</span>
                <span className={styles["card-year"]}>2019</span>
              </div>
            </div>
            <div className={styles["recent-card-content"]}>
              <h3 className={styles["recent-card-h3"]}>
                <a href="#">Skills To Develop Your Child Memory</a>
              </h3>
              <p>
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts.
              </p>
              <div className={styles["recent-card-feature"]}>
                <p className={styles["recent-card-readmore"]}>
                  <div className={styles["recent-card-btn"]}>
                    Read More{" "}
                    <span className="ion-ios-arrow-round-forward"></span>
                  </div>
                </p>
                <p className={styles["recent-card-role"]}>
                  <div className={styles["mr-2"]}>Admin</div>
                  <div className={styles["recent-card-chat"]}>
                    <span className={styles["icon-chat"]}></span> 3
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
