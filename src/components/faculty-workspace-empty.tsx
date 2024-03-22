import * as React from 'react';

import styles from "@/styles/components/faculty-workspace-empty.module.scss"
import {Icons} from "@/components/icons";

export function FacultyWorkspaceEmpty() {
  return (
    <div className={styles["layout-wrapper"]}>
      <div className={styles["layout-container"]}>
        <Icons.fileText />
        <h3>No Workspaces Found</h3>
        <p>Create a workspace to get started.</p>
      </div>
    </div>
  );
}
