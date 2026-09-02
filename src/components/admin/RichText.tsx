"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { uploadMedia } from "@/lib/upload-media";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/** Tiptap wrapper: the article body editor. Emits HTML; images upload straight
 *  to blob storage through the same route the public form uses. */
export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Image.configure({ HTMLAttributes: { class: "article-image" } }),
    ],
    content: value,
    // SSR-safe, and re-render on transactions so toolbar active states track.
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "article-prose min-h-[320px] rounded-b-md border border-t-0 bg-background px-4 py-3 text-sm focus:outline-none",
      },
    },
  });

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    setUploading(true);
    try {
      const uploaded = await uploadMedia(file);
      editor.chain().focus().setImage({ src: uploaded.url, alt: file.name }).run();
    } catch {
      /* the toolbar button just stops spinning; the field's own error state
         isn't worth the plumbing for an admin tool */
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function setLink(editor: Editor) {
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", current ?? "https://");
    if (url === null) return;
    if (url === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) {
    return <div className="min-h-[360px] animate-pulse rounded-md border bg-muted/40" />;
  }

  const tools: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
    disabled?: boolean;
    run: () => void;
  }> = [
    { label: "Bold", icon: Bold, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "Heading", icon: Heading2, active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Subheading", icon: Heading3, active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bullet list", icon: List, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Quote", icon: Quote, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Link", icon: Link2, active: editor.isActive("link"), run: () => setLink(editor) },
    { label: "Undo", icon: Undo2, disabled: !editor.can().undo(), run: () => editor.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, disabled: !editor.can().redo(), run: () => editor.chain().focus().redo().run() },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border bg-muted/40 px-1.5 py-1">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            variant={tool.active ? "secondary" : "ghost"}
            size="icon"
            aria-label={tool.label}
            title={tool.label}
            disabled={tool.disabled}
            onClick={tool.run}
            className="size-8"
          >
            <tool.icon className="size-4" />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Insert image"
          title="Insert image"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
          className="size-8"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
        </Button>
      </div>
      <EditorContent editor={editor} />
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleImage}
      />
    </div>
  );
}
