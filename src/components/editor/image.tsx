import { supabase } from "@/server/supabase/supabase"
import Image from "@editorjs/image"

export class EditorImage extends Image {
  async removed() {
    // access the image block's file data
    const { file } = this._data as { file: { url: string } }

    if (!file.url) {
      return
    }

    await supabase.storage
      .from("images")
      .remove([
        file.url.split(
          "https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/images/"
        )[1]!,
      ])
  }
}
