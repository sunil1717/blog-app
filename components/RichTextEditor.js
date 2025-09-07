"use client";

import dynamic from "next/dynamic";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Load the React wrapper only on the client to avoid SSR issues
const CKEditor = dynamic(
  async () => (await import("@ckeditor/ckeditor5-react")).CKEditor,
  { ssr: false }
);

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="border rounded bg-white">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_, editor) => onChange(editor.getData())}
        config={{
          toolbar: [
            "heading", "|",
            "bold", "italic", "underline", "strikethrough", "|",
            "numberedList", "bulletedList", "|",
            "link", "blockQuote", "undo", "redo"
          ],
        }}
      />
    </div>
  );
}
