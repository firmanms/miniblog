"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Undo, 
  Redo 
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 border rounded-md border-input bg-background text-sm ring-offset-background",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync initial value / external changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-1.5 border border-input rounded-md bg-muted/30">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          title="Tebal (Bold)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          title="Miring (Italic)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-[1px] bg-border mx-1 self-stretch" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <div className="w-[1px] bg-border mx-1 self-stretch" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("bulletList") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          title="Daftar Simbol (Bullet List)"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-muted transition-colors ${editor.isActive("orderedList") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          title="Daftar Angka (Ordered List)"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="w-[1px] bg-border mx-1 self-stretch mt-auto" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors disabled:opacity-40"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors disabled:opacity-40"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
