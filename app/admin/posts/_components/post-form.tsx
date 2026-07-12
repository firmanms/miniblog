"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/tiptap-editor";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface PostFormProps {
  categories: Category[];
  initialPost?: {
    id: string;
    title: string;
    slug: string;
    category_id: string | null;
    excerpt: string | null;
    content: string;
    is_published: boolean;
  };
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export function PostForm({ categories, initialPost, action, submitLabel }: PostFormProps) {
  const [content, setContent] = useState(initialPost?.content || "");
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");

  // Auto-generate slug from title if not editing and slug is not manually changed
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialPost) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  return (
    <form action={action} className="space-y-6">
      {initialPost && <input type="hidden" name="id" value={initialPost.id} />}
      
      {/* Hidden input to pass TipTap editor content through standard form submit */}
      <input type="hidden" name="content" value={content} />

      <div className="space-y-2">
        <Label htmlFor="title">Judul Artikel</Label>
        <Input 
          id="title" 
          name="title" 
          required 
          value={title}
          onChange={handleTitleChange}
          placeholder="Masukkan judul artikel..." 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug URL</Label>
        <Input 
          id="slug" 
          name="slug" 
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-url-artikel" 
        />
        <p className="text-xs text-muted-foreground">URL yang ramah mesin pencari (SEO friendly).</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Kategori</Label>
        <select 
          id="category_id" 
          name="category_id" 
          defaultValue={initialPost?.category_id || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
        <Input 
          id="excerpt" 
          name="excerpt" 
          defaultValue={initialPost?.excerpt || ""} 
          placeholder="Ringkasan singkat artikel untuk dihalaman depan..." 
        />
      </div>

      <div className="space-y-2">
        <Label>Konten Artikel</Label>
        <TiptapEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="is_published" 
          name="is_published" 
          value="true" 
          defaultChecked={initialPost?.is_published}
          className="w-4 h-4 rounded border-gray-300" 
        />
        <Label htmlFor="is_published">Terbitkan artikel segera</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/admin/posts" className={buttonVariants({ variant: "outline" })}>Batal</Link>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
