import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  // First, get the category to make sure it exists
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!category) {
    notFound();
  }

  // Then fetch posts for this category
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("category_id", category.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-8 py-16 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Kembali ke beranda
      </Link>

      <div className="flex flex-col space-y-4 md:space-y-6 mb-16 border-b pb-8">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Kategori: <span className="text-primary">{category.name}</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Menampilkan semua artikel yang diterbitkan di bawah kategori {category.name}.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Belum ada artikel dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group block">
              <Card className="h-full border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-foreground/20 group-hover:-translate-y-1 rounded-xl">
                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-secondary/40 hover:bg-secondary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {post.categories.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      {format(new Date(post.created_at), "d MMMM yyyy", { locale: localeID })}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
