import * as React from "react"

import styles from "@/styles/(lobby)/_components/faculty.module.scss"

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
          <div className={styles["faculty-card"]}>
            <div
              className={styles["faculty-card-img"]}
              style={{ backgroundImage: "url(images/course-1.jpg)" }}
            ></div>
            <div className={styles["faculty-card-content"]}>
              <p className={styles["faculty-card-info"]}>
                <span>
                  <i className="icon-user mr-2"></i>Mr. Khan
                </span>
                <span>
                  <i className="icon-table mr-2"></i>10 seats
                </span>
                <span>
                  <i className="icon-calendar mr-2"></i>4 Years
                </span>
              </p>
              <h3>
                <a href="#">Electric Engineering</a>
              </h3>
              <p>
                Separated they live in. A small river named Duden flows by their
                place and supplies it with the necessary regelialia. It is a
                paradisematic country
              </p>
              <p>
                <a href="#" className={styles["faculty-card-submit-btn"]}>
                  Apply now
                </a>
              </p>
            </div>
          </div>
          <div className={styles["faculty-card"]}>
            <div
              className={styles["faculty-card-img"]}
              style={{ backgroundImage: "url(images/course-2.jpg)" }}
            ></div>
            <div className={styles["faculty-card-content"]}>
              <p className={styles["faculty-card-info"]}>
                <span>
                  <i className="icon-user mr-2"></i>Mr. Khan
                </span>
                <span>
                  <i className="icon-table mr-2"></i>10 seats
                </span>
                <span>
                  <i className="icon-calendar mr-2"></i>4 Years
                </span>
              </p>
              <h3>
                <a href="#">Electric Engineering</a>
              </h3>
              <p>
                Separated they live in. A small river named Duden flows by their
                place and supplies it with the necessary regelialia. It is a
                paradisematic country
              </p>
              <p>
                <a href="#" className={styles["faculty-card-submit-btn"]}>
                  Apply now
                </a>
              </p>
            </div>
          </div>
          <div className={styles["faculty-card"]}>
            <div
              className={styles["faculty-card-img"]}
              style={{ backgroundImage: "url(images/course-3.jpg)" }}
            ></div>
            <div className={styles["faculty-card-content"]}>
              <p className={styles["faculty-card-info"]}>
                <span>
                  <i className="icon-user mr-2"></i>Mr. Khan
                </span>
                <span>
                  <i className="icon-table mr-2"></i>10 seats
                </span>
                <span>
                  <i className="icon-calendar mr-2"></i>4 Years
                </span>
              </p>
              <h3>
                <a href="#">Electric Engineering</a>
              </h3>
              <p>
                Separated they live in. A small river named Duden flows by their
                place and supplies it with the necessary regelialia. It is a
                paradisematic country
              </p>
              <p>
                <a href="#" className={styles["faculty-card-submit-btn"]}>
                  Apply now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
