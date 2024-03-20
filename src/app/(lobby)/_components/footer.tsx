import * as React from "react"

import styles from "@/styles/(lobby)/_components/footer.module.scss"

export function Footer() {
  return (
    <div className={styles["footer-wrapper"]}>
      <div className={styles["footer-img-wrapper"]}>
        <div className={styles["footer-img-container"]}>
          <div className={styles["footer-card"]}>
            <div
              className={styles["footer-card-img"]}
              style={{ backgroundImage: "url(images/image_1.jpg)" }}
            >
              <div className={styles["footer-card-icon"]}>
                <span className="icon-instagram"></span>
              </div>
            </div>
          </div>
          <div className={styles["footer-card"]}>
            <div
              className={styles["footer-card-img"]}
              style={{ backgroundImage: "url(images/image_2.jpg)" }}
            >
              <div className={styles["footer-card-icon"]}>
                <span className="icon-instagram"></span>
              </div>
            </div>
          </div>
          <div className={styles["footer-card"]}>
            <div
              className={styles["footer-card-img"]}
              style={{ backgroundImage: "url(images/image_3.jpg)" }}
            >
              <div className={styles["footer-card-icon"]}>
                <span className="icon-instagram"></span>
              </div>
            </div>
          </div>
          <div className={styles["footer-card"]}>
            <div
              className={styles["footer-card-img"]}
              style={{ backgroundImage: "url(images/image_4.jpg)" }}
            >
              <div className={styles["footer-card-icon"]}>
                <span className="icon-instagram"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className={styles["footer-content-wrapper"]}>
        <div className={styles["footer-content-container"]}>
          <div className={styles["footer-content"]}>
            <div className={styles["footer-content-col"]}>
              <div className={styles["footer-content-col-wrapper"]}>
                <h2 className={styles["footer-content-h2"]}>
                  Have a Questions?
                </h2>
                <div className={styles["footer-content-header"]}>
                  <ul>
                    <li>
                      <span className={styles["footer-content-text"]}>
                        203 Fake St. Mountain View, San Francisco, California,
                        USA
                      </span>
                    </li>
                    <li>
                      <div>
                        <span className={styles["footer-content-text"]}>
                          +2 392 3929 210
                        </span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className={styles["footer-content-text"]}>
                          info@yourdomain.com
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles["footer-content-col"]}>
              <div className={styles["footer-content-col-wrapper"]}>
                <h2 className={styles["footer-content-h2"]}>Recent Blog</h2>
                <div className={styles["footer-content-header-col2"]}>
                  <div
                    className={styles["footer-content-img"]}
                    style={{ backgroundImage: "url(images/image_1.jpg)" }}
                  ></div>
                  <div className={styles["footer-content-text"]}>
                    <h3>
                      <div>
                        Even the all-powerful Pointing has no control about
                      </div>
                    </h3>
                    <div>
                      <div>
                        <div>June 27, 2019</div>
                      </div>
                      <div>
                        <div>Admin</div>
                      </div>
                      <div>
                        <div>19</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles["footer-content-header-col2"]}>
                  <div
                    className={styles["footer-content-img"]}
                    style={{ backgroundImage: "url(images/image_2.jpg)" }}
                  ></div>
                  <div className={styles["footer-content-text"]}>
                    <h3>
                      <div>
                        Even the all-powerful Pointing has no control about
                      </div>
                    </h3>
                    <div>
                      <div>June 27, 2019</div>
                      <div></div>
                      <div>19</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["footer-content-col"]}>
              <div className={styles["footer-content-col-wrapper"]}>
                <h2 className={styles["footer-content-h2"]}>Links</h2>
                <ul>
                  <li>
                    <div className={styles["footer-content-text"]}>Home</div>
                  </li>
                  <li>
                    <div className={styles["footer-content-text"]}>About</div>
                  </li>
                  <li>
                    <div className={styles["footer-content-text"]}>
                      Services
                    </div>
                  </li>
                  <li>
                    <div className={styles["footer-content-text"]}>
                      Deparments
                    </div>
                  </li>
                  <li>
                    <div className={styles["footer-content-text"]}>Contact</div>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles["footer-content-col"]}>
              <div className={styles["footer-content-header-col3"]}>
                <h2 className={styles["footer-content-h2"]}>Subscribe Us!</h2>
                <form action="#" className={styles["subscribe-form"]}>
                  <div className={styles["form-group"]}>
                    <input
                      type="text"
                      className={styles["footer-input-text"]}
                      placeholder="Enter email address"
                    />
                    <input
                      type="submit"
                      value="Subscribe"
                      className={styles["footer-submit-form"]}
                    />
                  </div>
                </form>
              </div>
              <div className={styles["footer-content-header-col2"]}>
                <h2 className={styles["footer-content-h2"]}>Connect With Us</h2>
                <ul></ul>
              </div>
            </div>
          </div>
          <div className={styles["footer-copyright"]}>
            <div className={styles["footer-copyright-info"]}>
              <p>
                Copyright &copy;
                <script>document.write(new Date().getFullYear());</script> All
                rights reserved | This template is made with{" "}
                <i className="icon-heart" aria-hidden="true"></i> by{" "}
                <a href="https://colorlib.com" target="_blank">
                  Colorlib
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
