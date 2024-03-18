import * as React from 'react';

import styles from "@/styles/(lobby)/_components/faculty.module.scss"

export function Faculty() {
  return (
    <div className={styles["faculty-wrapper"]}>
      <div className={styles['faculty-container']}>
        <div className={styles["faculty-header-wrapper"]}>
          <div className={styles["faculty-header-container"]}>
            <h2>Our Faculties</h2>
            <p>We help students achieve academic excellence in a diverse range of disciplines and fields – through our excellent faculties.</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
