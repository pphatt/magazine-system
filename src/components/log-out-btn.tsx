import styles from "@/styles/components/layouts/site-header.module.scss";
import {Icons} from "@/components/icons";
import React from "react";
import {Button} from "@/components/ui/button";
import { signOut } from "@/server/auth/auth";

export function LogOutBtn() {
    return (
        <form className={styles["sign-out-form"]} action={async () => {
            "use server"
            await signOut()
        }}>
          <Button
              className={styles["sign-out"]}
              typeof={"submit"}
          >
            <span>Logout</span>
            <Icons.logout/>
          </Button>
        </form>
    )
}