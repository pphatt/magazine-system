import { supabase } from "@/server/supabase/supabase"
import Attaches from "@editorjs/attaches"

export class EditorAttaches extends Attaches {
  async removed() {
    // access the image block's file data
    const { file } = this._data as { file: { url: string } }

    if (!file.url) {
      return
    }

    await supabase.storage
      .from("faculty-assets")
      .remove([
        file.url.split(
          "https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/faculty-assets/"
        )[1]!,
      ])
  }
}
