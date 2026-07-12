import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("slug", resolvedParams.slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 sm:px-8 py-16 max-w-3xl">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Kembali ke beranda
      </Link>

      <header className="mb-12 border-b pb-10">
        <div className="flex items-center gap-3 mb-6 text-sm">
          {post.categories && (
            <Link href={`/categories/${post.categories.slug}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {post.categories.name}
              </Badge>
            </Link>
          )}
          <span className="text-muted-foreground font-medium">•</span>
          <span className="text-muted-foreground font-medium">
            {format(new Date(post.created_at), "d MMMM yyyy", { locale: localeID })}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-foreground">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed italic">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Render HTML dynamically generated from Tiptap WYSIWYG Editor */}
      <div 
        className="prose prose-zinc dark:prose-invert max-w-none prose-lg leading-relaxed prose-headings:font-bold prose-a:text-primary hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
