import Attaches from "@editorjs/attaches"
import {supabase} from "@/server/supabase/supabase";

export class EditorAttaches extends Attaches  {
  async removed() {
    // access the image block's file data
    const { file } = this._data as { file: { url: string } }

    await supabase.storage
      .from("images")
      .remove([
        file.url.split(
          "https://duwbantxkrrmpwimkocd.supabase.co/storage/v1/object/public/images/"
        )[1]!,
      ])
  }
}