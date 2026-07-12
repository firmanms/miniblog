import Link from "next/link";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { Search } from "lucide-react";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  const supabase = await createClient();
  
  // Build query
  let dbQuery = supabase
    .from("posts")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
  }

  const { data: posts, error } = await dbQuery;

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 max-w-4xl">
      {/* Search Bar Container */}
      <div className="mb-10">
        <form method="GET" action="/" className="relative flex items-center max-w-md">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari artikel..."
            className="flex h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:border-foreground/10 focus:border-foreground/20"
          />
          {query && (
            <Link
              href="/"
              className="absolute right-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Hapus
            </Link>
          )}
        </form>
      </div>

      {/* Grid of Posts */}
      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl">
          <p className="text-muted-foreground text-base">
            {query 
              ? `Tidak ada hasil pencarian untuk "${query}".`
              : "Belum ada artikel yang diterbitkan. Silakan kembali lagi nanti."
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group block">
              <Card className="h-full border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-foreground/20 group-hover:-translate-y-1 rounded-xl">
                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-center">
                    {post.categories && (
                      <Badge variant="secondary" className="bg-secondary/40 hover:bg-secondary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {post.categories.name}
                      </Badge>
                    )}
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
