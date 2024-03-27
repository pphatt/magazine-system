import * as React from "react"
import Link from "next/link"
import { db } from "@/server/db"
import { format, isBefore } from "date-fns"
import moment from "moment"
import { type User } from "next-auth"

import { currentUser } from "@/lib/auth/auth"
import { formatTimeForSubmissionDiff } from "@/lib/utils"
import { RenderWorkspace } from "@/components/render-workspace"
import SubmitContributions from "@/components/submit-contributions"
import styles from "@/styles/(magazine)/page.module.scss"

export default async function MagazinePage({
  params,
}: {
  params: { magazineId: string }
}) {
  const user = (await currentUser()) as User

  const { magazineId } = params

  const magazine = await db.workspace.findFirst({
    where: { id: magazineId },
    include: {
      creator: true,
    },
  })

  if (!magazine || !magazine.content) {
    return <></>
  }

  const contributions = await db.contributions.findFirst({
    where: { authorId: user.id, workspaceId: magazineId },
  })

  const content = magazine.content.blocks

  return (
    <div className={styles["magazine"]}>
      <div className={styles["magazine-wrapper"]}>
        <p className={styles["magazine-date"]}>
          Posted by <span>{magazine.creator.name}</span>{" "}
          {moment(magazine.createdAt).format("LL")}
        </p>
        <h1 className={styles["magazine-title"]}>{magazine.title}</h1>
        <p className={styles["magazine-deadline"]}>
          Deadline: {format(magazine.closureDate, "PPP")}
        </p>
        <RenderWorkspace content={content} />
      </div>

      {user.role === "STUDENT" && (
        <div className={styles["submission-zone"]}>
          <table className={styles["submission-table"]}>
            <tbody>
              <tr>
                <th>Submission status</th>
                <td data-submit={!!contributions}>
                  {contributions ? "Submit for grading" : "Not submitted"}
                </td>
              </tr>
              <tr>
                <th>Due date</th>
                <td>
                  {format(magazine.closureDate, "EEEE, d MMMM yyyy, hh:mm a")}
                </td>
              </tr>
              {contributions && (
                <tr>
                  <th>Time remaining</th>
                  <td>
                    Assignment was submitted{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {formatTimeForSubmissionDiff(
                        magazine.closureDate,
                        contributions.updatedAt
                      )}
                    </span>{" "}
                    early
                  </td>
                </tr>
              )}
              <tr>
                <th>Last modified</th>
                <td>
                  {contributions?.updatedAt
                    ? format(
                        contributions.updatedAt,
                        "EEEE, d MMMM yyyy, hh:mm a"
                      )
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>File submissions</th>
                <td data-submit={!!contributions}>
                  {!contributions ? (
                    isBefore(new Date(), magazine.closureDate) && (
                      <SubmitContributions
                        magazineId={magazine.id}
                        closureDate={magazine.closureDate}
                        userId={user.id!}
                      />
                    )
                  ) : (
                    <div className={styles["files-submission"]}>
                      {(JSON.parse(contributions.location) as string[]).map(
                        (value) => {
                          const _split = value.split("/")
                          return (
                            <Link
                              href={`https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contribution/${value}`}
                              className={styles["file"]}
                            >
                              {_split[_split.length - 1]}
                            </Link>
                          )
                        }
                      )}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/*<iframe*/}
          {/*  src="https://docs.google.com/gview?url=https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contribution/bf6715c7-5c0d-4951-be51-66f8eb5e705e/c760eec8-3d4f-4beb-95c8-61f19311eae6/1_Unit%202%20-%20Assignment%201%20frontsheet.docx&embedded=true"></iframe>*/}

          {/*<iframe*/}
          {/*  src="https://view.officeapps.live.com/op/embed.aspx?src=https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contribution/bf6715c7-5c0d-4951-be51-66f8eb5e705e/c760eec8-3d4f-4beb-95c8-61f19311eae6/1_Unit%202%20-%20Assignment%201%20frontsheet.docx"*/}
          {/*  width="1366px"*/}
          {/*  height="623px"*/}
          {/*  frameBorder="0"*/}
          {/*>*/}
          {/*</iframe>*/}

          {/*<object*/}
          {/*  data="https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contribution/40d0e9ee-5cf2-40b3-a275-772d7605c32a/c760eec8-3d4f-4beb-95c8-61f19311eae6/Vu%20Tien%20Phat.pdf"*/}
          {/*  type="application/pdf"*/}
          {/*  width="100%"*/}
          {/*  height="100%"*/}
          {/*>*/}
          {/*  <p>*/}
          {/*    Alternative text - include a link{" "}*/}
          {/*    <a href="https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/student-contribution/40d0e9ee-5cf2-40b3-a275-772d7605c32a/c760eec8-3d4f-4beb-95c8-61f19311eae6/Vu%20Tien%20Phat.pdf">*/}
          {/*      to the PDF!*/}
          {/*    </a>*/}
          {/*  </p>*/}
          {/*</object>*/}
        </div>
      )}
    </div>
  )
}
